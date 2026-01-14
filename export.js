/**
 * Module d'export du tableau en PNG et PDF
 * Utilise html2canvas pour la capture et jsPDF pour la génération PDF
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    const exportPngBtn = document.getElementById('export-png');
    const exportPdfBtn = document.getElementById('export-pdf');
    const tableContainer = document.getElementById('table-container');

    /**
     * Affiche une notification de succès
     * @param {string} message - Le message à afficher
     */
    function showNotification(message) {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Active/désactive l'état de chargement sur un bouton
     * @param {HTMLElement} button - Le bouton à modifier
     * @param {boolean} isLoading - État de chargement
     */
    function setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
        } else {
            button.classList.remove('loading');
        }
    }

    /**
     * Obtient la date formatée pour le nom de fichier
     * @returns {string} Date formatée
     */
    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}_${hours}-${minutes}`;
    }

    /**
     * Exporte le tableau en image PNG
     */
    async function exportToPng() {
        try {
            setLoading(exportPngBtn, true);

            // Capturer le tableau avec html2canvas
            const canvas = await html2canvas(tableContainer, {
                backgroundColor: '#ffffff',
                scale: 2, // Meilleure qualité
                logging: false,
                useCORS: true
            });

            // Créer le lien de téléchargement
            const link = document.createElement('a');
            link.download = `tableau_export_${getFormattedDate()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            showNotification('Tableau exporté en PNG avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'export PNG:', error);
            showNotification('Erreur lors de l\'export PNG');
        } finally {
            setLoading(exportPngBtn, false);
        }
    }

    /**
     * Exporte le tableau en document PDF
     */
    async function exportToPdf() {
        try {
            setLoading(exportPdfBtn, true);

            // Capturer le tableau avec html2canvas
            const canvas = await html2canvas(tableContainer, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true
            });

            // Créer le PDF avec jsPDF
            const { jsPDF } = window.jspdf;

            // Calculer les dimensions
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Déterminer l'orientation
            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

            // Créer le document PDF
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'px',
                format: [imgWidth / 2, imgHeight / 2]
            });

            // Ajouter l'image au PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 2, imgHeight / 2);

            // Télécharger le PDF
            pdf.save(`tableau_export_${getFormattedDate()}.pdf`);

            showNotification('Tableau exporté en PDF avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            showNotification('Erreur lors de l\'export PDF');
        } finally {
            setLoading(exportPdfBtn, false);
        }
    }

    // Ajouter les écouteurs d'événements
    exportPngBtn.addEventListener('click', exportToPng);
    exportPdfBtn.addEventListener('click', exportToPdf);
});
