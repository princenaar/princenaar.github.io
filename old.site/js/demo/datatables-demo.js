// Call the dataTables jQuery plugin
$(document).ready(function () {
    $('#dataTable').DataTable({
        "language": {
            "decimal": "",
            "emptyTable": "Aucune donn&eacute;e trouv&eacute;e",
            "info": "De _START_ a _END_ sur un total de _TOTAL_",
            "infoFiltered": "(filtr&eacute; parmi _MAX_ au total)",
            "infoPostFix": "",
            "thousands": " ",
            "lengthMenu": "Afficher par _MENU_ lignes",
            "loadingRecords": "Loading...",
            "processing": "Processing...",
            "search": "Rechercher",
            "zeroRecords": "Aucune entr&eacute;e correspondante",
            "paginate": {
                "first": "D&eacute;bute",
                "last": "Fin",
                "next": "Suivant",
                "previous": "Pr&eacute;c&eacute;dent"
            }
        }
    });
});
