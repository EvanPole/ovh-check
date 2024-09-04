const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://eco.ovhcloud.com/fr/';
const checkInterval = 10 * 60 * 1000; // 10 minutes en millisecondes

const discordWebhookUrl = 'https://discord.com/api/webhooks/1280573315379105802/y09kvpPyLwRhdCzg7raLLKi9zxYcb8rlp0gMte4-tAcyrMZnKkhfdLyiY9x8K4qfv62S';

async function checkAvailability() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Attendre 2 secondes avant de vérifier
        setTimeout(async () => {
            const ksAElement = $('div[data-qa="ks-a--intel-i7-6700k"]');

            if (ksAElement.length > 0) {
                const isUnavailable = ksAElement.find('div.otds-text:contains("Prochainement disponible")').length > 0;

                if (!isUnavailable) {
                    console.log('Le serveur KS-A est disponible pour la configuration !');

                    // Envoyer une notification au webhook Discord
                    await sendDiscordNotification('Le serveur KS-A est disponible pour la configuration !');
                } else {
                    console.log('Le serveur KS-A n\'est pas encore disponible.');
                }
            } else {
                console.log('Impossible de trouver l\'élément pour KS-A.');
            }
        }, 2000); // Attendre 2000 millisecondes (2 secondes)

    } catch (error) {
        console.error('Erreur lors de la vérification de la disponibilité:', error);
    }
}

async function sendDiscordNotification(message) {
    try {
        await axios.post(discordWebhookUrl, {
            content: message
        });
        console.log('Notification envoyée sur Discord.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification Discord:', error);
    }
}

setInterval(checkAvailability, checkInterval);

// Vérification initiale immédiatement après le démarrage du script
checkAvailability();
