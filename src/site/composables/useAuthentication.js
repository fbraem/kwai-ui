import {inject, provide} from '@vue/composition-api';
import Lockr from 'lockr';
import {useAPI} from '@/js/useAPI';
import {http, http_auth} from '@/js/http';
import {ref, computed} from '@vue/composition-api';
import Transformer from '@/js/jsonapi/Transformer';
import User from '@/models/users/User';
import {ability} from '@/js/ability';

const USER_KEY = 'user';
const USER_RULES_KEY = 'rules';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

let user = null;
let rules = null;
let access_token = null;
let refresh_token = null;

export default function createAuthenticationService() {
  const init = () => {
    user = ref(Lockr.get(USER_KEY, null));
    rules = ref(Lockr.get(USER_RULES_KEY, []));
    access_token = ref(Lockr.get(ACCESS_TOKEN_KEY, null));
    refresh_token = ref(Lockr.get(REFRESH_TOKEN_KEY, null));
  };

  const login = useAPI(async({email, password}) => {
    const form = {
      username: email,
      password
    };
    const json = await http
      .url('user/login')
      .formData(form)
      .post()
      .json()
    ;
    Lockr.set(ACCESS_TOKEN_KEY, json.access_token);
    access_token.value = json.access_token;
    Lockr.set(REFRESH_TOKEN_KEY, json.refresh_token);
    refresh_token.value = json.refresh_token;

    await getUser.run();
  });

  const getUser = useAPI(async() => {
    const json = await http_auth
      .url('user')
      .get()
      .json()
    ;
    user.value = new Transformer().deserialize(User, json);
    rules.value = [];
    if (user.value.abilities) {
      for (const ability of user.value.abilities) {
        for (const rule of ability.rules) {
          rules.value.push({
            action: rule.action,
            subject: rule.subject
          });
        }
      }
    }
    ability.update(rules.value);
    Lockr.set(USER_RULES_KEY, rules.value);
    Lockr.set(USER_KEY, user.value);
  });

  const refresh = useAPI(async() => {
    if (refresh_token.value) {
      const form = {
        refresh_token: refresh_token.value
      };
      const json = await http
        .url('user/access_token')
        .formData(form)
        .post()
        .json()
      ;
      Lockr.set(ACCESS_TOKEN_KEY, json.access_token);
      access_token.value = json.access_token;
      Lockr.set(REFRESH_TOKEN_KEY, json.refresh_token);
      refresh_token.value = json.refresh_token;

      await getUser.run();
    }
  });

  const logout = useAPI(async() => {
    const form = {
      refresh_token: refresh_token.value
    };
    try {
      await http_auth
        .url('user/logout')
        .formData(form)
        .post()
      ;
      reset();
    } catch (error) {
      if (error.response.status === 401) {
        reset();
      } else {
        console.log(error);
      }
    }
  });

  function reset() {
    ability.update([]);

    Lockr.rm(USER_KEY);
    user.value = null;
    Lockr.rm(USER_RULES_KEY);
    rules.value = [];
    Lockr.rm(ACCESS_TOKEN_KEY);
    access_token.value = null;
    Lockr.rm(REFRESH_TOKEN_KEY);
    refresh_token.value = null;
  }

  return {
    init,
    login,
    logout,
    getUser,
    refresh,
    reset,
    access_token,
    refresh_token,
    user,
    rules,
    isLoggedIn: computed(() => access_token.value != null)
  };
}

const AuthenticationSymbol = Symbol();

export function useAuthenticationStore() {
  return inject(AuthenticationSymbol);
}

export function provideAuthenticationStore() {
  provide(AuthenticationSymbol, createAuthenticationService());
}
