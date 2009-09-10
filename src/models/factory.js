/**
 * @author thatcher
 */
(function($,$$,$M){
    var log;
    //Factory is really just a static function
    $M.Factory = function(options){
        options = options||{};
        log = log||$.logger('Claypool.Models.Factory');
        
        var DB,
            dbconnection;
        
        //select the db client implementation
        //
        // - 'rest' is entirely abstract and is the most reusable accross databases
        //   since it requires no database specific implementations by the client.
        //   the rest server-side services would generally use the 'direct' db client then
        //   to service the rest clients requests
        //
        // - 'direct' requires a reference to the database plugin but is otherwise
        //   generic as well. the db implementation shares a set of
        //   dbconnection parameters which are used to initialize the local
        //   clients connection
        var dbclient = options&&options.dbclient?
            options.dbclient:$.env('dbclient');
        if(!dbclient){
            dbclient = 'rest';
        }
        log.debug("loading database client connection %s", dbclient);
        if(dbclient=='rest'){
            dbclient = new $M.RestClient(options);
        }else if(dbclient == 'direct'){
            //get the database implementation and connection information
            DB = options&&options.db?
                    options.db:$.env('db');
            dbconnection = options&&options.dbconnection?
                    options.dbconnection:$.env('dbconnection');
            log.debug("loading database implementation %s", DB);
            if(typeof(DB)=='string'){
                log.debug("resolving database implementation %s", DB);
                DB = $.resolve(DB);
            }
            dbclient = new $M.Client($.extend({
                //initialize the database connection
                db: new DB(dbconnection)
			},options));
        }
        return dbclient;
    };
    
})(jQuery, Claypool, Claypool.Models);
