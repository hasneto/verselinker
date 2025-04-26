// verserlinkerhasneto.js
$(document).ready(function() {
    // Carregar os arquivos JSON
    const bibleUrl = "https://hasneto.github.io/verselinker/NAA.json";
    const citationUrl = "https://hasneto.github.io/verselinker/pt.json";

    $.getJSON(bibleUrl, function(bibleData) {
        $.getJSON(citationUrl, function(citationData) {
            // Processar cada post
            $('.post-body').each(function() {
                let content = $(this).html();

                // Regex para identificar as citações
                const regex = /(\b(?:João|Mateus|Obadias|Filemom|2 João|3 João|Judas)\s+\d+[:.]\d+(?:[-—]\d+)?(?:,\s*\d+[:.]\d+)?|\b(?:João|Mateus|Obadias|Filemom|2 João|3 João|Judas)\s+\d+(?:[-—]\d+)?|\b(?:João|Mateus|Obadias|Filemom|2 João|3 João|Judas)\s+\d+)\b/g;

                content = content.replace(regex, function(match) {
                    // Aqui você pode buscar o texto exato da citação no bibleData
                    const tooltipText = bibleData[match] || "Texto não encontrado";
                    return `<a href="#" class="bible-reference" title="${tooltipText}" style="color: #015264; font-weight: bold; text-decoration: underline dotted;">${match}</a>`;
                });

                $(this).html(content);
            });

            // Tooltip com jQuery
            $('.bible-reference').hover(function() {
                const tooltip = $(this).attr('title');
                $(this).data('tipText', tooltip).removeAttr('title');
                $('<p class="tooltip"></p>')
                    .html(`<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6W249LCXs8KKhYgAn85uKlxXmTIq4_NtFLiURoI4nsQf8ZhDYuCfIsIKl7fv5KBB1PfvVBXoycJyGpUICX3S4pWNMt8QIzORQIsVRtbwbBaHfwf6-gXv9KTP352zmCBrS8xu9UlYCs78HS3mEGyXr7OvP43rJ26D4B_7y1k88Po-j-dGGMdgciaAToQ/s1600/icone3.png" alt="Logo" style="height: 20px;"/> <strong>${tooltip}</strong>`)
                    .appendTo('body')
                    .fadeIn('slow');
            }, function() {
                $(this).attr('title', $(this).data('tipText'));
                $('.tooltip').remove();
            }).mousemove(function(e) {
                const mouseX = e.pageX + 10; // Offset para a tooltip
                const mouseY = e.pageY + 20; // Offset para a tooltip
                $('.tooltip').css({ top: mouseY, left: mouseX });
            });
        });
    });
});
