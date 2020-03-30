const StaffMember = require('../models/staff');
register = async function (user) {
    var email = user.email, fName = user.firstName, lName = user.lastName, password = user.password;
    var member = new StaffMember();
    member.setEmail(email);
    member.setPlainPassword(password);
    member.setFirstName(fName);
    member.setLastName(lName);
    member.setWorkspaceId(user.workspaceId);
    return member.register();
}
module.exports = {register};