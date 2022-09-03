declare namespace Express {
    export interface Request {
       user?: object ,
       page?: number ,
    }
    export interface Response {
      paginatedResult?: object
    }
 }