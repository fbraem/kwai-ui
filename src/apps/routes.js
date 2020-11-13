import activitiesRouter from './activities/routes';
import authorRouter from './author/routes';
import clubRouter from './club/routes';
import judoRouter from './judo/routes';
import newsRouter from './news/routes';
import portalRouter from './portal/routes';
import categoriesRouter from './categories/routes';
import pagesRouter from './pages/routes';
import usersRouter from './users/routes';
import membersRouter from './members/routes';
import seasonsRouter from './seasons/routes';
import shopRouter from './shop/routes';
import teamsRouter from './teams/routes';
import eventsRouter from './events/routes';
import tournamentsRouter from './tournaments/routes';
import trainingsRouter from './trainings/routes';
import userRouter from './user/routes';

function makeRoutes() {
  return []
    .concat(activitiesRouter)
    .concat(authorRouter)
    .concat(clubRouter)
    .concat(judoRouter)
    .concat(newsRouter)
    .concat(portalRouter)
    .concat(categoriesRouter)
    .concat(pagesRouter)
    .concat(usersRouter)
    .concat(membersRouter)
    .concat(seasonsRouter)
    .concat(shopRouter)
    .concat(teamsRouter)
    .concat(eventsRouter)
    .concat(tournamentsRouter)
    .concat(trainingsRouter)
    .concat(userRouter)
  ;
}

export default makeRoutes;
