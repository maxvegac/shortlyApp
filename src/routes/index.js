import { BaseRoute } from "./route";
/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {
    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    static create(router) {
        //log
        console.log("[IndexRoute::create] Creating index route.");
        //add home page route
        router.get("/url", (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
    }
    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    index(req, res, next) {
        //set custom title
        this.title = "Home";
        //set message
        let options = {
            "message": "I like turtles"
        };
        //render template
        res.json({
            title: this.title,
            options: options
        });
    }
}
