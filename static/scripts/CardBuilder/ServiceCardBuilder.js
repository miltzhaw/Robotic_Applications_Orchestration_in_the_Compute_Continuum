import { CardBuilder } from "./CardBuilder.js";
import { Utility } from "../Utility/Utility.js";


class ServiceCardBuilder extends CardBuilder {
    /**
     * Constructor of the class ServiceHandler
    */
    constructor() {
        super();
        myLog.msg(`Initialize Service Handler`, 20);
    }


    /**
     * Builds the cards for the services
     * 
     * @param   {object[]}      services    The services to load
     * 
     * @returns  {void}
     * 
     * @access  public
    */
    buildCard = services => {
        myLog.l(`Build service cards`);

        // Reset the robot list
        document.getElementById(`service-list`).previousElementSibling.innerHTML = services.length === 0 ? `<b><i>No services found!</i></b>` : `Select a services to see its robots by clicking on it`;

        services.forEach(service =>  this.#buildCard(service));
    }


    /**
     * Remove the service card
     * 
     * @param   {object}    service     The service to remove
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    removeCard = service => {
        myLog.l(`Remove service card for ${service.url}`);
        Utility.debugLog(`Service '${service.url}' has been removed`, `blue`);

        document.getElementById(`service-${service.url}`).parentElement.remove();
    }


    /**
     * Builds the cards for the services
     * 
     * @param   {object}      service    The service
     * 
     * @returns  {void}
     * 
     * @access  private
     */
    #buildCard = service => {
        let col = document.createElement(`div`);
        col.classList.add(`w3-col`, `s12`, `m6`, `l6`);

        // Create the card
        let card = document.createElement(`div`);
        card.classList.add(`card`);
        card.id = `service-${service.url}`;
        card.title = `Select '${service.label}'`;
        card.onclick = (elem) => this.cardSelected(elem, service, `service`);
        let img = document.createElement(`img`);
        img.src = `static/images/service.svg`;
        img.draggable = false;
        img.loading = `lazy`;
        img.alt = service.label;

        // Create the container
        let container = document.createElement(`div`);
        container.classList.add(`container`);
        let name = document.createElement(`b`);
        name.innerText = service.label;
        container.appendChild(name);
        let descripton = document.createElement(`p`);
        descripton.innerHTML = `<span>Description:</span> ${service.description ?? `-`}`;
        container.appendChild(descripton);
        this.#getRobots(service, container);

        // Add the footer
        let footer = document.createElement(`div`);
        footer.classList.add(`card-footer`);
        let startButton = document.createElement(`button`);
        startButton.title = `Start the service`;
        startButton.classList.add(`w3-button`, `w3-green`, `w3-round`, `w3-small`);
        startButton.innerText = `Start`;
        startButton.onclick = e => this.#prepareService(e.target, service, true);
        footer.appendChild(startButton);
        let stopButton = document.createElement(`button`);
        stopButton.title = `Stop the service`;
        stopButton.classList.add(`w3-button`, `w3-red`, `w3-round`, `w3-small`);
        stopButton.innerText = `Stop`;
        stopButton.onclick = e => this.#prepareService(e.target, service, false);
        footer.appendChild(stopButton);

        // Append the elements
        card.appendChild(img);
        card.appendChild(container);
        card.appendChild(footer);
        col.appendChild(card);
        document.getElementById(`service-list`).appendChild(col);
    }


    /**
     * Returns the robots which are available for the service
     * 
     * @param   {object}        service     The service to search for
     * @param   {HTMLElement}   container   The container to append to
     * 
     * @returns {void}
     * 
     * @access  private
     */
    #getRobots = (service, container) => {
        let serviceText = document.createElement(`p`);
        serviceText.innerHTML = `<span>Available Robots:</span>`;
        let serviceList = document.createElement(`ul`);

        service.availableRobots = service.availableRobots ?? [];

        window.Orchestrator.robots.forEach(robot => {
            robot.services.availableServices?.forEach(serv => {
                if (serv?.name === service?.url) {
                    service.availableRobots.push(robot.name);

                    let robotLi = document.createElement(`li`);
                    robotLi.classList.add(`w3-text-green`);
                    robotLi.innerText = robot.name;
                    serviceList.appendChild(robotLi);
                }
            });
        });

        // No services found
        if (serviceList.children.length === 0) {
            serviceText.innerHTML += `<br><span class="w3-text-red">There are no robots for this service!</span>`;
        }

        container.appendChild(serviceText);
        container.appendChild(serviceList);
    }


    /**
     * Adds or updates a service card
     * 
     * @param   {object}    service     The service to add or update
     * @param   {boolean}   add         If the service should be added
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    addOrupdateService = (service, add = false) => {
        // Check if a new service card should be created
        if (add === true) {
            myLog.l(`Add service card for ${service.url}`);
            Utility.debugLog(`Service '${service.url}' has been added`, `blue`);

            this.#buildCard(service);
        } else {
            // Check if the received robot has been updated
            if (window.Orchestrator.services?.find(s => s.id === service.id)?.lastUpdated === service.lastUpdated) {
                myLog.l(`Service ${service.url} has not been updated`)
                return;
            }

            myLog.l(`Update service card for ${service.url}`);
            Utility.debugLog(`Service '${service.url}' has been updated`, `blue`);

            // Update the description
            document.getElementById(`service-${service.url}`).querySelector(`p`).innerHTML = `<span>Description:</span> ${service.description ?? `-`}`;

            // Update the robots
            let serviceList = document.getElementById(`service-${service.url}`).querySelector(`ul`);
            serviceList.innerHTML = ``;
            this.#getRobots(service, serviceList.parentElement);
        }
    }


    /**
     * Updates the cards after selecting a service
     * 
     * @returns  {void}
     * 
     * @access  public
     */
    updateCards = () => {
        // Disable all cards
        $(`#robot-list .card`).addClass(`disabled-card`);

        // Enable the cards for the selected service
        CardBuilder.selectedCard.availableRobots?.forEach(robot => {
            document.getElementById(`robot-${robot}`).classList.remove(`disabled-card`);

            // Check if the service is running on the robot
            let robotUuid = window.Orchestrator.robots.find(rbt => rbt.name === robot)?.properties?.find(prop => prop.name === `uuid`).value;
            let started = window.Orchestrator.policies?.find(policy => policy.service.name === CardBuilder.selectedCard.url)?.constraints?.find(constraint => constraint.indexOf(`uuid=`) !== -1 && constraint.indexOf(`uuid=${robotUuid}`) !== -1) ? true : false;

            // Update the footer
            let cardFooter = document.getElementById(`robot-${robot}`).querySelector(`.card-footer`);
            cardFooter.style.display = `block`;
            cardFooter.querySelector(`.w3-green`).disabled = started;
            cardFooter.querySelector(`.w3-red`).disabled = !started;
        });
    };


    /**
     * Starts a service on a robot
     * 
     * @param   {HTMLElement}   btn     The button that was clicked
     * @param   {object}        service The service
     * @param   {boolean}       start   If the service should be started
     * 
     * @returns {void}
     * 
     * @access  private
     */
    #prepareService = (btn, service, start = true) => {
        myLog.l(`${start ? `Starting` : `Stopping`} service ${service.label} on robot ${CardBuilder.selectedCard.name}`);

        // Disable the button to prevent multiple clicks
        btn.disabled = true;

        let policyId = window.Orchestrator.policies.find(policy => policy.service.name === service.url)?.id;
        let uuid = CardBuilder.selectedCard.properties.find(prop => prop.name === `uuid`)?.value;

        let data = {
            robot: CardBuilder.selectedCard.name,
            service: service.label,
            start: start,
            uuid: uuid
        };

        window.Orchestrator.policyHandler.updatePolicy(btn, policyId, data);
    }
}

export { ServiceCardBuilder as ServiceCardBuilder };