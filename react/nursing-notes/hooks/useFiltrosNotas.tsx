import { useState, useMemo } from 'react';

export const useFiltrosNotas = (notas) => {
    const [filtros, setFiltros] = useState({
        enfermera: '',
        fecha: ''
    });

    const notasFiltradas = useMemo(() => {
        if (!notas || !Array.isArray(notas)) return [];

        return notas.filter(nota => {
            const coincideEnfermera = !filtros.enfermera ||
                (nota.user_id && nota.user_id.toString() === filtros.enfermera);

            let coincideFecha = true;
            if (filtros.fecha) {
                const fechaNota = formatDateForFilter(nota.created_at);
                const fechaFiltro = formatDateForFilter(filtros.fecha);
                coincideFecha = fechaNota === fechaFiltro;
            }

            return coincideEnfermera && coincideFecha;
        });
    }, [notas, filtros]);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFiltros({ enfermera: '', fecha: '' });
    };

    const formatDateForFilter = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            const dia = date.getDate().toString().padStart(2, "0");
            const mes = (date.getMonth() + 1).toString().padStart(2, "0");
            const año = date.getFullYear();

            return `${dia}/${mes}/${año}`;
        } catch (error) {
            console.error("Error formateando fecha:", error);
            return '';
        }
    };

    return {
        filtros,
        notasFiltradas,
        aplicarFiltros,
        limpiarFiltros
    };
};