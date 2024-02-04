class RobotHandler {
    /**
     * Constructor of the class RobotHandler
    */
    constructor() {
        myLog.msg(`Initialize Robot Handler`, 20);
    }

    /**
     * Loads the robots 
     * 
     * @returns  {Promise<void>}
     * 
     * @access  public
     * @async
    */
    loadRobots = async () => {
        return new Promise((resolve, reject) => {
            myLog.l(`Load robots`);

            $.ajax({
                type: 'GET',
                url: `/API/robots`,
                contentType: 'application/json',
                success: robots => {
                    myLog.l(`Robots successfully recieved`)
                    myLog.l(robots);

                    return resolve(robots);
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

export { RobotHandler as RobotHandler };