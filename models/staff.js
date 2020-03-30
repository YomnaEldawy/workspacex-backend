const executeQuery = require('../config/db');
const bcrypt = require('bcrypt')
var validator = require("email-validator");
class StaffMember {

    constructor() {
        this.id = 0;
        this.email = ""
        this.encryptedPassword = "";
        this.plainPassword = "";
        this.firstName = "";
        this.lastName = "";
        this.workspaceId = 0;
        this.requiredFields = ['email', 'plainPassword', 'firstName', 'lastName'];
    }

    setId(id) {
        this.id = id;
    }

    setEmail(email) {
        this.email = email;
    }

    setEncryptedPassword(encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    setPlainPassword(plainPassword) {
        this.plainPassword = plainPassword;
    }

    setFirstName(fName) {
        this.firstName = fName;
    }

    setLastName(lName) {
        this.lastName = lName;
    }

    setWorkspaceId(workspaceId) {
        this.workspaceId = workspaceId;
    }

    async validateRegistration() {
        if (this.plainPassword.length < 6) return {success: false, reason: 'Password must be at least 6 characters'};
        for (var i in this.requiredFields) {
            if (!this[this.requiredFields[i]] || !this[this.requiredFields[i]].length)
                return { success: false, reason: `${this.requiredFields[i]} is required` };
        }
        if (!validator.validate(this.email)) return { success: false, reason: `invalid Email` };
        const usersWithEmail = await executeQuery(`select email from StaffMember where email='${this.email}'`);
        if (usersWithEmail.length) return { success: false, reason: `E-mail already exists` };
        if (this.workspaceId) {
            const wokrspace = await executeQuery(`select * from Workspace where id = ${this.workspaceId}`);
            if (!wokrspace.length) return {success: false, reason: `Workspace does not exist`};
        }
        return { success: true }
    }

    async encrypt() {
        const salt = await bcrypt.genSalt(10);
        var encrypted_pass = await bcrypt.hash(this.plainPassword, salt);
        this.encryptedPassword = encrypted_pass;
    }
    async register() {
        await this.encrypt();
        if (!this.validateRegistration().success) return this.validateRegistration();
        var columns = ['email', 'encryptedPassword', 'firstName', 'lastName'];
        var values = [this.email, this.encryptedPassword, this.firstName, this.lastName];
        if (this.workspaceId) {
            columns.push('workspaceId');
            values.push(this.workspaceId);
        }
        for (var i in values) {
            values[i] = `'${values[i]}'`;
        }
        var q = `insert into StaffMember (${columns.join(', ')}) values (${values.join(',')})`;
        var result = await executeQuery(q);
        return result;
    }

}

module.exports = StaffMember;