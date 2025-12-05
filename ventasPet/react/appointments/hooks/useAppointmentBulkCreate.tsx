import { useState } from 'react'
import { appointmentService } from '../../../services/api'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'

export const useAppointmentBulkCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createAppointmentBulk = async (appointments: Omit<any, 'id'>, patientId: string) => {
        setLoading(true)
        try {
            await appointmentService.bulkCreate(appointments, patientId)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createAppointmentBulk }
}
