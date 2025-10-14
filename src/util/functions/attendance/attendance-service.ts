import { AttendanceModel } from '../../../models/attendance'

export const updateAttendance = async (data: AttendanceModel, project: string) => {
    if (!project) throw new Error('Project not found')

    const response = await fetch(`/api/module/project?data=attendance&id=${data.id}&project=${project}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update attendance')
    return response.json()
}

export const getAttendanceById = async (id: string, project: string) => {
    if (!project) throw new Error('Project not found')

    const response = await fetch(`/api/module/project?data=attendance&id=${id}&project=${project}`)
    if (!response.ok) throw new Error('Failed to get attendance')
    return response.json()
}