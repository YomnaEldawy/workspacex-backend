const StaffMember = require('../models/staff');
register = async function (user) {
    var email = user.email, fName = user.firstName, lName = user.lastName, password = user.password;
    var member = new StaffMember();
    member.email = email;
    member.plainPassword = password;
    member.firstName = fName;
    member.lastName = lName;
    member.workspaceId = user.workspaceId;
    return member.register();
}

login = async function (email, password) {
    var member = new StaffMember();
    member.email =email;
    member.plainPassword = password;
    return member.login();
}
module.exports = {register, login};