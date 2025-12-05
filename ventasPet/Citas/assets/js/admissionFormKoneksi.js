import { appointmentService, patientService, productService } from "../../../services/api/index.js";
import { getValidConsultationClaimUrl, saveConsultationClaimUrl, getValidConsultationClaimId, saveConsultationClaimId } from "../../../services/koneksiLocalStorage.js";
import { getBeneficiaryLocation, getConsultationClaim, getConsultationClaimLocationUrl, getFormSlugs, initConsultationClaim, searchBeneficiary } from "../../../services/koneksiService.js";

const btnAuthorizePatient = document.getElementById('btnAuthorizePatient');

const formSlugsSelect = document.getElementById('formSlugs');

const koneksiPatientContainer = document.getElementById('koneksiPatientContainer');
const koneksiPatientIdField = document.getElementById('koneksiPatientId');
const koneksiPatientLoadingContainer = document.getElementById('koneksiPatientLoadingContainer');
const koneksiPatientLoadingLabel = document.getElementById('koneksiPatientLoadingLabel');

const koneksiError = document.getElementById('koneksiError');
const koneksiErrorMessage = document.getElementById('koneksiErrorMessage');

const koneksiSuccess = document.getElementById('koneksiSuccess');
const koneksiSuccessMessage = document.getElementById('koneksiSuccessMessage');

const amountAuthorisation = document.getElementById('amountAuthorisation');
const authorisationNumberEntity = document.getElementById('authorisationNumberEntity');

let patient = null;
let appointment = null;
let product = null;
let consultationClaim = null;

const formSlug = () => formSlugsSelect.value;
const sponsorSlug = () => patient.social_security.entity.koneksi_sponsor_slug;
const koneksiPatientId = () => koneksiPatientIdField.value;
const productCode = () => product.barcode;

export const claimId = () => localStorage.getItem(`consultation_claim_id_${patient.id}_${appointment.id}`);

export async function init() {

    const patientId = document.getElementById('patientIdForUpdate').value;
    patient = await patientService.get(patientId);

    console.log("Koneksi patient:", patient);

    if (sponsorSlug()) {

        koneksiPatientContainer.classList.remove('d-none');

        koneksiPatientIdField.value = patient.document_number;

        const formSlugs = await getFormSlugs(sponsorSlug());
        setFormSlugOptions(formSlugs);

        const appointmentId = new URLSearchParams(window.location.search).get('id_cita');
        appointment = await appointmentService.get(appointmentId);

        const productId = appointment.product_id;
        product = await productService.getProductById(productId);

        if (getValidConsultationClaimId(patient.id, appointment.id)) {
            authorizePatient();
        }
    }
}

async function authorizePatient() {

    let searchedPatient = null;
    let beneficiaryId = null;

    btnAuthorizePatient.classList.add('d-none');
    koneksiPatientLoadingContainer.classList.remove('d-none');
    koneksiError.classList.add('d-none');

    koneksiErrorMessage.textContent = '';

    const data = {
        sponsorSlug: sponsorSlug(),
        formSlug: formSlug(),
        search: koneksiPatientId()
    }

    koneksiPatientLoadingLabel.textContent = 'Buscando paciente...';

    const patientLocationUrl = await getBeneficiaryLocation(data);

    try {

        searchedPatient = await searchBeneficiary(patientLocationUrl);

    } catch (error) {

        console.log(error);

        koneksiError.classList.remove('d-none');
        koneksiPatientLoadingContainer.classList.add('d-none');
        btnAuthorizePatient.classList.remove('d-none');

        koneksiErrorMessage.textContent = error.message;

        return;
    }

    const searchedPatients = searchedPatient.content.filter(p => p.identity_document_id === koneksiPatientId());
    beneficiaryId = searchedPatients.length ? searchedPatients[0].id : searchedPatient.content[0].id;

    if (!beneficiaryId) {

        koneksiError.classList.remove('d-none');
        btnAuthorizePatient.classList.remove('d-none');

        koneksiErrorMessage.textContent = 'No se encontró el paciente. Verifica el ID o intenta con otro campo de busqueda.';

        return;
    }

    koneksiPatientLoadingLabel.textContent = 'Autorizando paciente...';

    let consultationClaimLocationUrl = getValidConsultationClaimUrl(patient.id, appointment.id);

    if (!consultationClaimLocationUrl) {

        try {

            consultationClaimLocationUrl = await getConsultationClaimLocationUrl({
                beneficiaryId: beneficiaryId,
                sponsorSlug: sponsorSlug(),
                productCode: productCode()
            });

            saveConsultationClaimUrl(consultationClaimLocationUrl, patient.id, appointment.id);

        } catch (error) {

            console.log(error);

            koneksiError.classList.remove('d-none');
            koneksiPatientLoadingContainer.classList.add('d-none');
            btnAuthorizePatient.classList.remove('d-none');

            koneksiErrorMessage.textContent = error.message;

            return;
        }
    }

    try {
        const claimId = getValidConsultationClaimId(patient.id, appointment.id);

        if (claimId) {
            consultationClaim = await getConsultationClaim(claimId);
        } else {
            consultationClaim = await initConsultationClaim(consultationClaimLocationUrl, patient.id, appointment.id);
        }

    } catch (error) {

        console.log(error);

        koneksiError.classList.remove('d-none');
        koneksiPatientLoadingContainer.classList.add('d-none');
        btnAuthorizePatient.classList.remove('d-none');

        koneksiErrorMessage.textContent = error.message;

        return;
    }

    authorisationNumberEntity.value = consultationClaim.sponsor_transaction_id;
    amountAuthorisation.value = consultationClaim.amount;

    saveConsultationClaimId(consultationClaim.id, patient.id, appointment.id);

    koneksiPatientLoadingContainer.classList.add('d-none');
    btnAuthorizePatient.classList.add('d-none');
    koneksiSuccess.classList.remove('d-none');

    koneksiSuccessMessage.textContent = 'Paciente autorizado con éxito.';
}

function setFormSlugOptions(formSlugs) {

    formSlugsSelect.innerHTML = '';

    formSlugs.forEach(formSlug => {
        const option = document.createElement('option');
        option.value = formSlug.slug
        option.textContent = formSlug.name
        formSlugsSelect.appendChild(option);
    });
}

btnAuthorizePatient.addEventListener('click', authorizePatient);