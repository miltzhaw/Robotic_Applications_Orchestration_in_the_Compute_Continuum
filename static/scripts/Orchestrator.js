import { Utility } from "./Utility/Utility.js";
import { RobotCardBuilder } from "./CardBuilder/RobotCardBuilder.js";
import { ServiceCardBuilder } from "./CardBuilder/ServiceCardBuilder.js";
import { PolicyHandler } from "./Handler/PolicyHandler.js";
import { RobotHandler } from "./Handler/RobotHandler.js";
import { ServiceHandler } from "./Handler/ServiceHandler.js";

class Orchestrator {
    /**
     * The interval for refreshing the data
     * 
     * @type {number}
     * 
     * @access  private
    */
    #refreshInterval;


    /**
     * The available policies
     * 
     * @type {object}
     * 
     * @access  private
    */
    #policies = {};
    get policies() {
        return this.#policies;
    }
    set policies(policies) {
        this.#policies = policies;
    }

    /**
     * The available robots
     * 
     * @type {object}
     * 
     * @access  private
    */
    #robots = {};
    get robots() {
        return this.#robots;
    }
    set robots(robots) {
        this.#robots = robots;
    }

    /**
     * The available services
     * 
     * @type {object}
     * 
     * @access  private
     */
    #services = {};
    get services() {
        return this.#services;
    }
    set services(services) {
        this.#services = services;
    }


    /**
    *  Constructor of the class Orchestrator
    */
    constructor() {
        myLog.msg(`Initialize Orchestrator`, 25);

        // Initialize the builders
        this.robotBuilder = new RobotCardBuilder();
        this.serviceBuilder = new ServiceCardBuilder();

        // Initialize the handlers
        this.policyHandler = new PolicyHandler();
        this.roboHandler = new RobotHandler();
        this.serviceHandler = new ServiceHandler();

        // Load the policies, robots and services
        this.policyHandler.loadPolicy()
            .then(async () => this.#robots = await this.roboHandler.loadRobots())
            .then(async () => this.#services = await this.serviceHandler.loadServices())
            .then(() => {
                this.robotBuilder.buildCards(this.#robots);
                this.serviceBuilder.buildCard(this.#services);

                // Update timestamp
                let date = new Date();
                document.getElementById('timestamp').innerHTML = `${date.toLocaleDateString("en-CH", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString("en-CH")}`;

                // Start the interval
                this.#refreshInterval = setInterval(() => this.#refreshData(), 1000);

                Utility.debugLog(`Ready!`);
            })
            .catch(() => window.myLog.console(`Error while loading the policies, robots and services`, 'error'));
    }


    /**
     * Refreshes the data
     * 
     * @returns  {Promise<void>}
     * 
     * @access  public
    */
    #refreshData = async () => {
        window.myLog.msg(`Refresh data`, 13);


        // Load the policies, services and robots
        await this.policyHandler.loadPolicy();
        let robots = await this.roboHandler.loadRobots();
        let services = await this.serviceHandler.loadServices();

        // Delete robots which are not available anymore
        let robotIDs = robots.map(robot => robot.id);
        this.#robots = this.#robots.filter((robot, index) => {
            if (robotIDs.includes(robot.id)) {
                return true;
            }
            else {
                this.robotBuilder.removeCard(robot);
                delete this.#robots[index];
                return false;
            }
        });

        // Delete services which are not available anymore
        let serviceIDs = services.map(service => service.url);
        this.#services = this.#services.filter((service, index) => {
            if (serviceIDs.includes(service.url)) {
                return true;
            }
            else {
                this.serviceBuilder.removeCard(service);
                delete this.#services[index];
                return false;
            }
        });


        // Add new robots and update existing robots
        robots.forEach(robot => {
            if (!this.#robots.find(r => r.id === robot.id)) {
                this.#robots.push(robot);
                this.robotBuilder.addOrupdateRobot(robot, true);
            } else {
                this.robotBuilder.addOrupdateRobot(robot, false);
            }
        });
        this.#robots.forEach(robot => this.robotBuilder.updateService(robot));


        // Add new services and update existing services
        services.forEach(service => {
            if (!this.#services.find(s => s.url === service.url)) {
                this.#services.push(service);
                this.serviceBuilder.addOrupdateService(service, true);
            } else {
                this.serviceBuilder.addOrupdateService(service, false);
            }
        });


        // Update timestamp
        let date = new Date();
        document.getElementById('timestamp').innerHTML = `${date.toLocaleDateString("en-CH", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString("en-CH")}`;

        window.myLog.msg(`Refresh data done`, 13);
    }
}

((global) => global.Orchestrator = global.Orchestrator ?? new Orchestrator())(window);