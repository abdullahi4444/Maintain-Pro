namespace Maintenance_Request_System_API.Models;

public enum Role
{
    ADMIN,
    TECHNICIAN,
    REQUESTER
}

public enum Status
{
    PENDING,
    ASSIGNED,
    IN_PROGRESS,
    COMPLETED,
    REJECTED
}

public enum Priority
{
    LOW,
    MEDIUM,
    HIGH,
    URGENT
}
