import { validate } from "class-validator";

export default class EntityValidatorService {

    public async validateEntity(entity: any) {
        return await validate(entity)
        .then(errors => {
            if (errors.length > 0) {
                const message = errors.map(error => 
                    "Error on property '" + error.property + "': " + error.constraints).join(', ');
                
                return { success: false, message };
            } else {
                return { success: true };
            }
        });
    }
}