class ServiceHandler{
    /**
     * Constructor of the class ServiceHandler
    */
    constructor() {
        myLog.msg(`Initialize Service Handler`, 20);
    }


    /**
     * Loads the services
     * 
     * @returns  {Promise<void>}
     * 
     * @access  public
     * @async
    */
    loadServices = async () => {
        return new Promise((resolve, reject) => {
            myLog.l(`Load services`);

            $.ajax({
                type: 'GET',
                url: `/API/services`,
                contentType: 'application/json',
                success: services => {
                    myLog.l(`Services successfully recieved`)
                    myLog.l(services);

                    return resolve(services);
                },
                error: (z, h, a, w) => {
                    window.myLog.console(z, 'error');
                    window.myLog.console(z?.responseText, 'error');
                    window.myLog.console(h, 'error');
                    window.myLog.console(a, 'error');
                    window.myLog.console(w, 'error');

                    return reject();
                }
            });
        });
    }

}

export { ServiceHandler as ServiceHandler };