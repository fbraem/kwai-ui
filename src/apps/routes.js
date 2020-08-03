import authorRouter from './author/routes';
import clubRouter from './club/routes';
import newsRouter from './news/routes';
import portalRouter from './portal/routes';
import categoriesRouter from './categories/routes';
import pagesRouter from './pages/routes';
import usersRouter from './users/routes';
import membersRouter from './members/routes';
import seasonsRouter from './seasons/routes';
import teamsRouter from './teams/routes';
import eventsRouter from './events/routes';
import trainingsRouter from './trainings/routes';
import userRouter from './user/routes';

function makeRoutes() {
  return []
    .concat(authorRouter)
    .concat(clubRouter)
    .concat(newsRouter)
    .concat(portalRouter)
    .concat(categoriesRouter)
    .concat(pagesRouter)
    .concat(usersRouter)
    .concat(membersRouter)
    .concat(seasonsRouter)
    .concat(teamsRouter)
    .concat(eventsRouter)
    .concat(trainingsRouter)
    .concat(userRouter)
  ;
}

export default makeRoutes;
