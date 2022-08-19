module.exports = class UserDto {
    email;
    name;
    surname;
    role;
    id;
    is_activated;

    constructor(model) {
        this.email = model.email;
        this.name = model.name;
        this.surname = model.surname;
        this.role = model.role;
        this.id = model.id;
        this.is_activated = model.is_activated;
    }
}