import { EmployeeModel } from "../models/employee";

const getFullName = (employee: EmployeeModel) => {
    return employee?.middleName ? `${employee?.firstName ?? ''} ${employee?.middleName ?? ''} ${employee?.surname ?? ''}` : `${employee?.firstName ?? ''} ${employee?.surname ?? ''}`
}

export default getFullName;

export const getEmployeeInitials = (employee: EmployeeModel) => {
    const [firstName, lastName] = (employee.firstName ?? '').split(' ');
    if (firstName && lastName) {
        return `${firstName?.trim()[0]?.toUpperCase() ?? ''}${lastName?.trim()[0]?.toUpperCase() ?? ''}`
    } else {
        return `${employee.firstName?.trim()[0]?.toUpperCase() ?? ''}${employee.surname?.trim()[0]?.toUpperCase() ?? ''}`
    }
}