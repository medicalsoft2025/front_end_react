import { base64Biometric } from "../Citas/assets/js/biometric"
import { fetchWithToken, getLocationUrl } from "./koneksiHelpers"
import { token, providerSlug } from "./koneksiGlobals"
import { clearConsultationClaimUrl } from "./koneksiLocalStorage"

const beneficiaryId = ''
const biometricReadingId = ''
const claimId = ''

export async function getSponsors() {

    const url = `providers/v1/providers/${providerSlug()}/sponsors`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function getFormSlugs(sponsorSlug) {

    const url = `beneficiary-lookup/v1/sponsors/${sponsorSlug}/forms`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function getBeneficiaryLocation({ sponsorSlug, formSlug, search }) {

    const url = `beneficiary-lookup/v1/sponsors/${sponsorSlug}/search`

    const { locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            form_slug: formSlug,
            provider_slug: providerSlug(),
            inputs: [
                {
                    slug: formSlug,
                    value: search
                }
            ]
        }
    });

    return locationUrl;
}

export async function searchBeneficiary(locationUrl) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.content) {

            return data;

        } else if (data.status === "IN_PROGRESS") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    throw new Error("Ha ocurrido un error al obtener la información del paciente. Por favor intenta nuevamente.");
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    throw new Error("El paciente consultado no existe.");
                default:
                    break;
            }
        }
    }

    throw new Error("Se ha agotado el tiempo de espera. Por favor intenta nuevamente.");
}

function validateBiometric() {

    const url = `arc/v1/providers/${providerSlug()}/biometric-reading`

    const response = fetchWithToken({
        endpoint: url,
        method: "POST",
        data: {
            beneficiary_id: beneficiaryId,
            type: "FINGERPRINT_READING",
            value: base64Biometric
        }
    });

    const data = response.json();
}

export async function getConsultationClaimLocationUrl({ beneficiaryId, sponsorSlug, productCode }) {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim`

    const { responseData, locationUrl } = await getLocationUrl({
        endpoint: url,
        method: "POST",
        data: {
            beneficiary_id: beneficiaryId,
            sponsor_slug: sponsorSlug,
            provider_transaction_id: "00001",
            sponsor_parameters: {
                product_code: productCode
            }
        }
    });

    if (!locationUrl) {

        if (responseData) {

            switch (responseData.code) {
                case "025-0500":
                    if (responseData.errors.find(e => e.path === "sponsor_parameters.product_code")) {
                        throw new Error("El producto no es válido para el paciente consultado.");
                    }
                    break;
                default:
                    break;
            }
        }

        throw new Error("No se pudo obtener la URL de la reclamación de consulta.");
    }

    return locationUrl;
}

export async function initConsultationClaim(locationUrl, patientId, appointmentId) {

    let maxAttempts = 5;
    let delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        const response = await fetchWithToken({
            endpoint: locationUrl,
            method: "GET",
            usePrefix: false
        });

        const data = await response.json();

        console.log(`Intento ${attempt}:`, data);

        if (data.sponsor_transaction_id) {

            return data;

        } else if (data.status === "PENDING") {

            await new Promise(resolve => setTimeout(resolve, delay));

        } else {
            console.error(data);

            switch (data.code) {
                case "004-0300":
                    clearConsultationClaimUrl(patientId, appointmentId);
                    throw new Error("Ha ocurrido un error al obtener la información de la reclamación. Por favor intenta nuevamente.");
                default:
                    break;
            }

            switch (data.error_code) {
                case "023-0500":
                    throw new Error("El paciente consultado no existe.");
                default:
                    break;
            }
        }
    }

    throw new Error("Se ha agotado el tiempo de espera. Por favor intenta nuevamente.");
}

export async function getConsultationClaim(claimId) {

    const url = `arc/v2/providers/${providerSlug()}/claims/${claimId}`

    const response = await fetchWithToken({
        endpoint: url,
        method: "GET"
    });

    const data = await response.json()

    return data
}

export async function cancelConsultationClaim(claimId) {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim/${claimId}/void`;

    const response = await fetchWithToken({
        endpoint: url,
        method: "POST"
    });

    const data = await response.json()

    return data
}

function completeConsultation() {

    const url = `arc/v1/providers/${providerSlug()}/outpatient-care-claim/${claimId}/complete`

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`
        },
        body: JSON.stringify({
            "doctor_medical_license_number": "898",
            "doctor_country_code": "DO",
            "doctor_specialty_name": "Medicina General",
            "doctor_name": "Integracion Koneksi",
            "diagnoses": [
                {
                    "code": "Z00.0",
                    "coding_system": "ICD-10"
                }
            ],
            "biometric_reading_id": biometricReadingId,
            "document_number": "89798798",
            "document_date": new Date().toISOString(),
            "document_digital_signature": null,
            "medical_consultation_reason": "Aqui agregamos el motivo de la consulta",
            "illness_history": "Aqui agregamos el historial de la enfermedad/", //Opcional
            "illness_evolution_time": "Aqui agregamos el tiempo de evolucion.", //Opcional
            "non_standardized_diagnoses": "Agregamos un diagnosticos de GASTRITIS AGUDA y.COLITIS." //Opcional
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
    })
}