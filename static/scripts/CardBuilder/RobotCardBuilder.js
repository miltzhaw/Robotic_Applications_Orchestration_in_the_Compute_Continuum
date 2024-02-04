import { CardBuilder } from "./CardBuilder.js";
import { Utility } from "../Utility/Utility.js";


class RobotCardBuilder extends CardBuilder {
    /**
     * Constructor of the class RobotCardBuilder
    */
    constructor() {
        super();
        myLog.msg(`Initialize Robot Card Builder`, 20);
    }


    /**
     * Builds the cards for the robots
     * 
     * @param   {object[]}  robots  The robots
     * 
     * @returns  {void}
     * 
     * @access  public
    */
    buildCards = async (robots) => {
        myLog.l(`Build robot cards`);

        // Reset the robot list
        document.getElementById(`robot-list`).previousElementSibling.innerHTML = robots.length === 0 ? `<b><i>No robots found!</i></b>` : `Select a robot to see its services by clicking on it`;

        robots.forEach(robot => this.#buildCard(robot));
    }


    /**
     * Removes a robot card
     * 
     * @param   {object}  robot  The robot
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    removeCard = robot => {
        myLog.l(`Remove robot card for ${robot.name}`);
        Utility.debugLog(`Robot '${robot.name}' has been removed`, `blue`);

        document.getElementById(`robot-${robot.name}`).parentElement.remove();
    }


    /**
     * Updte the service array list of a robot
     * 
     * @param   {object}  robot  The robot
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    updateService = robot => this.#getServices(robot);


    /**
     * Builds the cards for the robots
     * 
     * @param   {object}  robot  The robot
     * 
     * @returns  {void}
     * 
     * @access  private
    */
    #buildCard = robot => {
        let col = document.createElement(`div`);
        col.classList.add(`w3-col`, `s12`, `m6`, `l6`);

        // Add the card
        let card = document.createElement(`div`);
        card.classList.add(`card`);
        card.id = `robot-${robot.name}`;
        card.title = `Select '${robot.name}'`;
        card.onclick = (elem) => this.cardSelected(elem, robot, `robot`);
        let img = document.createElement(`img`);
        img.src = Utility.getValueFromArrayKey(robot.properties, `image`) ?? `static/images/robot.svg`;
        img.draggable = false;
        img.loading = `lazy`;
        img.alt = robot.name;

        // Add the container
        let container = document.createElement(`div`);
        container.classList.add(`container`);
        let name = document.createElement(`b`);
        name.innerText = robot.name;
        container.appendChild(name);
        Utility.appendPropertyToContainer(container, `Model`, robot.properties, `model`);
        Utility.appendPropertyToContainer(container, `Has Camera`, robot.properties, `has_camera`);
        Utility.appendPropertyToContainer(container, `RPLidar`, robot.properties, `rplidar`);
        this.#getServices(robot, container);
        this.#getRunningServices(robot, container);


        // Add the footer
        let footer = document.createElement(`div`);
        footer.classList.add(`card-footer`);
        let startButton = document.createElement(`button`);
        startButton.classList.add(`w3-button`, `w3-green`, `w3-round`, `w3-small`);
        startButton.title = `Start the service`;
        startButton.innerText = `Start`;
        startButton.onclick = (e) => this.#prepareService(e.target, robot, true);
        footer.appendChild(startButton);
        let stopButton = document.createElement(`button`);
        stopButton.title = `Stop the service`;
        stopButton.classList.add(`w3-button`, `w3-red`, `w3-round`, `w3-small`);
        stopButton.innerText = `Stop`;
        stopButton.onclick = (e) => this.#prepareService(e.target, robot, false);
        footer.appendChild(stopButton);

        // Append the elements
        card.appendChild(img);
        card.appendChild(container);
        card.appendChild(footer);
        col.appendChild(card);
        document.getElementById(`robot-list`).appendChild(col);
    }


    /**
     * Returns the robots services
     * 
     * @param   {object}        robot       The robot
     * @param   {HTMLElement}   container   The container to append to
     * 
     * @returns {void}
     * 
     * @access  private
    */
    #getServices = (robot, container = undefined) => {
        robot.services.availableServices = [];
        let serviceText = document.createElement(`p`);
        serviceText.innerHTML = `<span>Available Services:</span>`;
        let serviceList = document.createElement(`ul`);

        window.Orchestrator.policies.forEach(policy => {
            for (let constraint of policy.constraints) {
                constraint = constraint.split(`=`);
                // This constraint is not relevant for the robot
                // It defines if the services already has been started
                if (constraint[0].startsWith(`uuid`)) {
                    // policy.service.flagName = constraint[1];
                    continue;
                }

                // Check if the constraint is fulfilled
                if (Utility.getValueFromArrayKey(robot.properties, constraint[0]) != constraint[1]) {
                    return;
                }
            }

            // Add the service to the robot
            robot.services.availableServices.push(policy.service);

            let serviceLi = document.createElement(`li`);
            serviceLi.classList.add(`w3-text-green`);
            serviceLi.innerText = policy.service.name;
            serviceList.appendChild(serviceLi);
        });

        // No services found
        if (serviceList.children.length === 0) {
            serviceList.innerHTML += `<span class="no-service">There are no services available for this robot!</span>`;
        }

        // Append the elements
        if (container !== undefined) {
            container.appendChild(serviceText);
            container.appendChild(serviceList);
        }
    }


    /**
     * Updates the running services of a robot or create a new card
     * 
     * @param   {object}    robot   The robot
     * @param   {boolean}   add     If the card should be added
     * 
     * @returns {void}
     * @access  public
     */
    addOrupdateRobot = (robot, add = false) => {
        // Check if a new robot card should be created
        if (add === true) {
            // Create new robot card
            this.#buildCard(robot);
            Utility.debugLog(`Created new robot card for ${robot.name}`, `blue`);
        }
        else {
            // Check if the received robot has been updated
            if (window.Orchestrator.robots?.find(r => r.id === robot.id)?.lastUpdated.nodeStatus === robot.lastUpdated.nodeStatus) {
                myLog.l(`Robot ${robot.name} has not been updated`)
                return;
            }

            // Update the robot card
            let serviceList = document.getElementById(`robot-${robot.name}`).querySelector(`.container`).querySelector(`ul:last-child`);
            serviceList.innerHTML = ``;
            this.#buildServiceList(serviceList, robot);

            // Update the robot
            let indes = window.Orchestrator.robots.findIndex(r => r.id === robot.id);
            window.Orchestrator.robots[indes] = robot;
        }
    }


    /**
     * Return the running services of a robot
     * 
     * @param   {object}        robot       The robot
     * @param   {HTMLElement}   container   The container to append to
     * 
     * @returns {void}
     * 
     * @access  private
     */
    #getRunningServices = (robot, container) => {
        let serviceText = document.createElement(`p`);
        serviceText.innerHTML = `<span>Services on the Robot:</span>`;
        let serviceList = document.createElement(`ul`);

        this.#buildServiceList(serviceList, robot);

        container.appendChild(serviceText);
        container.appendChild(serviceList);
    }


    /**
     * Starts a service on a robot
     * 
     * @param   {HTMLElement}   btn     The button that was clicked
     * @param   {object}        robot   The robot
     * 
     * @returns {void}
     * @access private
     */
    #buildServiceList = (serviceList, robot) => {
        robot.services.services?.forEach(service => {
            let policy = window.Orchestrator.policies.find(policy => policy.service.name === service.serviceUrl);
            let serviceLi = document.createElement(`li`);
            let color = `orange`;

            // Check if the service is running
            if (service.containerStatus[0]?.state === `running`) {
                color = `green`;
                serviceLi.classList.add(`w3-text-green`);
            } else if (service.containerStatus[0]?.state === `stopped`) {
                color = `red`;
                serviceLi.classList.add(`w3-text-red`);
            } else {
                serviceLi.classList.add(`w3-text-orange`);
            }

            Utility.debugLog(`Service '${service.serviceUrl}' is ${service.containerStatus[0]?.state}`, color);

            serviceLi.innerText = policy.service.name;
            serviceLi.title = `Status: ${service.containerStatus[0]?.state ?? `unknown`}`;

            // Check if the service is running and if it has a url
            let url = null;
            if ((url = policy.properties.find(prop => prop.name === "foxglove.url")?.value) != null && service.containerStatus[0]?.state === `running`) {
                serviceLi.appendChild(document.createElement(`br`));
                serviceLi.innerHTML += `<a href="${url.replaceAll(`{RAOCC_ROBOT_NAME}`, robot.name)}" class="link" target="_blank" title="Open Link in new tab">Open Foxglove</a>`;
            }

            serviceList.appendChild(serviceLi);
        });

        // No services found
        if (serviceList.children.length === 0) {
            serviceList.innerHTML += `<span class="no-service">There are no services on this robot!</span>`;
        }
    }


    /**
     * Updates the cards after selecting a robot
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    updateCards = () => {

        // Disable all cards
        $(`#service-list .card`).addClass(`disabled-card`);

        // Enable the cards for the selected robot
        CardBuilder.selectedCard.services.availableServices?.forEach(service => {
            document.getElementById(`service-${service.name}`).classList.remove(`disabled-card`);

            // Check if the service is running on the robot
            let robotUuid = CardBuilder.selectedCard.properties?.find(prop => prop.name === `uuid`).value;
            let started = window.Orchestrator.policies?.find(policy => policy.service.name === service.name)?.constraints?.find(constraint => constraint.indexOf(`uuid=`) !== -1 && constraint.indexOf(`uuid=${robotUuid}`) !== -1) ? true : false;

            // Update the footer
            let cardFooter = document.getElementById(`service-${service.name}`).querySelector(`.card-footer`);
            cardFooter.style.display = `block`;
            cardFooter.querySelector(`.w3-green`).disabled = started;
            cardFooter.querySelector(`.w3-red`).disabled = !started;
        });
    };


    /**
     * Starts a service on a robot
     * 
     * @param   {HTMLElement}   btn     The button that was clicked
     * @param   {object}        robot   The robot
     * @param   {boolean}       start   If the service should be started
     * 
     * @returns {void}
     * 
     * @access  private
     */
    #prepareService = (btn, robot, start = true) => {
        myLog.l(`${start ? `Starting` : `Stopping`} service ${CardBuilder.selectedCard.label} on robot ${robot.name}`);

        // Disable the button to prevent multiple clicks
        btn.disabled = true;

        let policyId = window.Orchestrator.policies.find(policy => policy.service.name === CardBuilder.selectedCard.url)?.id;
        let uuid = robot.properties.find(prop => prop.name === `uuid`)?.value;

        let data = {
            robot: robot.name,
            service: CardBuilder.selectedCard.label,
            start: start,
            uuid: uuid
        };

        window.Orchestrator.policyHandler.updatePolicy(btn, policyId, data);
    }
}

export { RobotCardBuilder as RobotCardBuilder };