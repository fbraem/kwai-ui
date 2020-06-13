import siteRouter from './site/routes';
import newsRouter from './news/routes';
import categoriesRouter from './categories/routes';
import pagesRouter from './pages/routes';
import usersRouter from './users/routes';
import membersRouter from './members/routes';
import seasonsRouter from './seasons/routes';
import teamsRouter from './teams/routes';
import eventsRouter from './events/routes';
import trainingsRouter from './trainings/routes';
import clubsRouter from './clubs/routes';
import userRouter from './user/routes';

function makeRoutes() {
  return []
    .concat(siteRouter)
    .concat(newsRouter)
    .concat(categoriesRouter)
    .concat(pagesRouter)
    .concat(usersRouter)
    .concat(membersRouter)
    .concat(seasonsRouter)
    .concat(teamsRouter)
    .concat(eventsRouter)
    .concat(trainingsRouter)
    .concat(clubsRouter)
    .concat(userRouter)
  ;
}

export default makeRoutes;
