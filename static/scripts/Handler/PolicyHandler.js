import { Utility } from "../Utility/Utility.js";

class PolicyHandler {
    /**
     * Constructor of the class PolicyHandler
    */
    constructor () {
        myLog.msg(`Initialize Policy Handler`, 20);
    }


    /**
     * Loads the policies asynchronously
     * 
     * @returns  {Promise<void>}
     * 
     * @access  public
    */
    loadPolicy = async () => {
        return new Promise((resolve, reject) => {
            myLog.l(`Load policies`);

            $.ajax({
                type: 'GET',
                url: `/API/policies`,
                contentType: 'application/json',
                success: policies => {
                    myLog.l(`Policies successfully recieved`)
                    myLog.l(policies);
                    window.Orchestrator.policies = policies;
                    return resolve();
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


    /**
     * Update the business policy on the management hub
     * 
     * @param   {HTMLElement}   btn         The button that was clicked
     * @param   {string}        policyId    The id of the policy
     * @param   {object}        data        The data to send
     * 
     * @returns {void}
     * 
     * @access  public
     */
    updatePolicy = (btn, policyId, data) => {
        myLog.l(`Updated constraints of policy ${policyId}`);
        myLog.l(data);

        $.ajax({
            type: 'PUT',
            url: `/API/policies/${policyId}`,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: (response) => {
                window.myLog.l(response);

                Utility.debugLog(`${data.start ? `Started` : `Stopped`} service '${data.service}'`, data.start ? `green` : `orange`);

                // Update the button
                if (data.start) {
                    btn.nextElementSibling.disabled = false;
                } else {
                    btn.previousElementSibling.disabled = false;
                }
            },
            error: (z, h, a, w) => {
                window.myLog.console(z, 'error');
                window.myLog.console(z?.responseText, 'error');
                window.myLog.console(h, 'error');
                window.myLog.console(a, 'error');
                window.myLog.console(w, 'error');

                btn.disabled = false;
            }
        });
    }
}

export { PolicyHandler as PolicyHandler };