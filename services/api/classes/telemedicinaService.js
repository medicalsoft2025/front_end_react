import BaseApiService from './baseApiService.js';

export class TelemedicinaService extends BaseApiService {
    async createRoom() {
        return await this.httpClient.post('api/v1/telemedicina/video-consultas/create-room', {
            doctorId: '12'
        })
    }

    async sendRoomOpenNotification({roomID, token, appointmentId}) {
        return await this.httpClient.post('medical/telemedicine/send/room-open-notifications', {
            roomID,
            token,
            appointmentId
        })
    }
}

export default TelemedicinaService;