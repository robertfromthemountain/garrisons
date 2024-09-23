import { ref } from "vue";
import { useRouter } from 'vue-router';
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

export function serviceVariables() {
    const { t } = useI18n();

    const services = reactive({
        serviceTitle: '',
        serviceDuration: '',
        servicePrice: ''
    });

    const getSer
}