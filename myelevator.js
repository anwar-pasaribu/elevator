/*
 * Available information:
 * 1. Request queue
 * Simulator.get_instance().get_requests()
 * Array of integers representing floors where there are people calling the elevator
 * eg: [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
 * 
 * 2. Elevator object
 * To get all elevators, Simulator.get_instance().get_building().get_elevator_system().get_elevators()
 * Array of Elevator objects.
 * - Current floor
 * elevator.at_floor()
 * Returns undefined if it is moving and returns the floor if it is waiting.
 * - Destination floor
 * elevator.get_destination_floor()
 * The floor the elevator is moving toward.
 * - Position
 * elevator.get_position()
 * Position of the elevator in y-axis. Not necessarily an integer.
 * - Elevator people
 * elevator.get_people()
 * Array of people inside the elevator
 * 
 * 3. Person object
 * - Floor
 * person.get_floor()
 * - Destination
 * person.get_destination_floor()
 * - Get time waiting for an elevator
 * person.get_wait_time_out_elevator()
 * - Get time waiting in an elevator
 * person.get_wait_time_in_elevator()
 * 
 * 4. Time counter
 * Simulator.get_instance().get_time_counter()
 * An integer increasing by 1 on every simulation iteration
 * 
 * 5. Building
 * Simulator.get_instance().get_building()
 * - Number of floors
 * building.get_num_floors()
 */

 var op_num = 1;

Elevator.prototype.decide = function() {
    var simulator = Simulator.get_instance();  
    var building = simulator.get_building();
    var num_floors = building.get_num_floors();
    var elevators = Simulator.get_instance().get_building().get_elevator_system().get_elevators();  // Array of Elevator objects.
    var time_counter = simulator.get_time_counter();
    var requests = simulator.get_requests();  // [7,3,2] // There are 3 people waiting for the elevator at floor 7,3, and 2, in that order
    
    if(requests.length == 0) {
        return;
    }

    var elevator = this;
    var people = this.get_people();
    var person = people.length > 0 ? people[0] : undefined;

    // console.log("Person: " + JSON.stringify(person));
    // console.log("People: " + people.length);
    // console.log("Num Floor: " + num_floors);
    
    if(elevator) {
        elevator.at_floor();
        elevator.get_destination_floor();
        elevator.get_position();

        console.warn("~~~("+ time_counter +")~~~\nElevator ("+elevator.id+"):" + JSON.stringify(elevator));
        console.info("[ iter "+ time_counter +"] Elevator "+elevator.id+" Pos: " + elevator.get_position());
        // console.log("Elevator - get_position:" + elevator.get_position());
        // console.log("---");

    } else {
        console.warn(time_counter + " - No Elevator");
    }
    
    if(person) {
        console.info("Person ( iter "+ time_counter +"):" + JSON.stringify(person));
        //console.log("---");
        person.get_floor();


        if(this.get_people().length <= this.max_num_people) {

            // Add people to elevator
            this.get_people().push(person);

            var persons_dest = [];
            for (var i = this.get_people().length - 1; i >= 0; i--) {
                 persons_dest.push(this.get_people()[i].get_destination_floor());
            };

            // Sort req first
            persons_dest = persons_dest.sort(function (a, b) { 
                return a - b;
            });

            for (var i = persons_dest.length - 1; i >= 0; i--) {
                // if(persons_dest[i] == this.get_people()[i])
            };

            console.info("Persons dest:" + JSON.stringify(persons_dest));
            console.warn("Elevator after pushed: \n" + JSON.stringify(this));
        }

        // Mulai proses elevator
        console.info("[Commit "+ time_counter +"] "
                    + this.get_people().length + " Persons from floor: "
                    + person.get_floor() + " move to: " 
                    + person.get_destination_floor() + ", Pos:" 
                    + this.get_position() + " by elevator: " 
                    + this.id);

        return this.commit_decision(person.get_destination_floor());
    } else {
        console.log("[iter "+ time_counter +"] - No person");
    }
    
    
    // Sort req first
    requests = requests.sort(function (a, b) { 
        return a - b;
    });

    console.log("Requests [iter "+ time_counter +"]: ("+ requests.length+") : "+ JSON.stringify(requests));

    // console.log("[sorted] Req: ("+ requests.length+") : "+ JSON.stringify(requests));
    // console.log("Elev: ("+ elevators.length+") : "+ JSON.stringify(elevators));

    for(var i = 0;i < requests.length;i++) {
        var handled = false;
        var people_total = 0;

        // Loop  through elevators
        for(var j = 0;j < elevators.length;j++) {
            // typeof myVar != 'undefined'
            if(typeof elevators[j].get_people() != 'undefined') {
                // console.log("[Loop] Elevators ("+elevators[j].id+") - Req: "+requests[i]
                //     + ", Pe: "+ elevators[j].get_people().length 
                //     + ", Des: " + elevators[j].get_destination_floor()
                //     + ", At: " + elevators[j].at_floor());

                people_total = people_total + elevators[j].get_people().length;
            }
            // Sampai tujuan
            if(elevators[j].get_destination_floor() == requests[i] ) {
                handled = true;
                break;
            }
        }
        if(!handled) {
            console.info("[loop][Commit "+ time_counter +"] " 
                + this.get_people().length+ " People elevated to floor: " 
                + requests[i] + " from floor " 
                + this.get_position() + " by elevator: " 
                + this.id);
            return this.commit_decision(requests[i]);
        }
    }

    // console.debug("Operation num: " + op_num);
    op_num = op_num + 1;

    var target_floor = Math.floor(num_floors / 2);
    if (requests.length != 0 ) {
        // console.info("[Commit "+ time_counter +"] Elevator move to: " 
        //             + target_floor + " from: " 
        //             + this.get_position() + " by elevator: " 
        //             + this.id);
        //return this.commit_decision(target_floor);  // Ke lantai 15
    }


};
