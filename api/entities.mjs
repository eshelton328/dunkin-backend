import method from './method.mjs'

export const createIndividualEntity = async (employee) => {
    try {
        const [month, day, year] = employee.dob.split('-');
        const formattedDob = `${year}-${month}-${day}`;
        const entity = await method.entities.create({
            type: 'individual',
            individual: {
                first_name: employee.firstName,
                last_name: employee.lastName,
                phone: '15121231111',
                dob: formattedDob,
            }
        })
        return entity
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const createCorporateEntity = async (payor) => {
    try {
        let zip = payor.address.zip;
        let state = payor.address.state;
        if (zip === "67485") {
            state = "KS"
        }
        const entity = await method.entities.create({
            type: 'c_corporation',
            corporation: {
                name: payor.name,
                dba: payor.dba,
                ein: payor.ein,
                owners: [],
            },
            address: {
                line1: payor.address.street,
                line2: null,
                city: payor.address.city,
                state: state,
                zip: zip,
            }
        })

        return entity;
    } catch (error) {
        console.log(error)
        return false;
    }
}