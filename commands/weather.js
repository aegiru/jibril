const Discord = require("discord.js");
const request = require('request');
const xml2JS = require('xml2js');

exports.run = async (bot, message, args) => {
    let weatherhelpEmbed = new Discord.RichEmbed()
        .setAuthor('Something went wrong. Make sure to use command correctly')
        .addField('Usage', `weather [location] [temperature type - C or F]`);
    message.channel.startTyping();
    message.channel.send('Fetching weather info...').then((msg) => {

        if (args.length < 2) {
            msg.edit(weatherhelpEmbed);
            message.channel.stopTyping();
            return;
        }

            let tempFormat = ["C", "F"].includes(args[args.length - 1].toUpperCase()) ? args[args.length - 1] : "C";


            let xmlParser = new xml2JS.Parser({ attrkey: 'A$', charkey: 'C$', explicitArray: true });
            let place = args.slice(0, -1).join(' ');
            let tempType = args[args.length - 1];
            let result = [];
            let weatherUrl = `http://weather.service.msn.com/data.aspx?weasearchstr=${encodeURIComponent(place)}&culture=en-US&weadegreetype=${tempType}&src=outlook`;

            try {
                request.get(weatherUrl, function (err, res, body) {
                    if (body.startsWith('"Weather-location')) { msg.edit('Location not found.'); }
                    if (res.statusCode === 404) {
                        msg.edit(weatherhelpEmbed);
                    }
                    if (res.statusCode !== 200) return console.log(`REQUEST FAILED - ${res.statusCode}`);
                    if (err) {
                        return console.log("Request Error" + error);
                    }
                    if (!body) return console.log('NO BODY');

                    if (body.indexOf('<') !== 0) {
                        if (body.search(/not found/i) !== -1) {
                            return console.log(result);
                        }
                        return console.log(`INVALID BODY CONTENT`);
                    }

                    xmlParser.parseString(body, function (err, resultJSON) {
                        if (err) {
                            console.log('Parser Error' + err);
                        }
                        if (!resultJSON || !resultJSON.weatherdata || !resultJSON.weatherdata.weather)
                            return console.log('failed to parse data');
                        if (resultJSON.weatherdata.weather['A$'] && resultJSON.weatherdata.weather['A$'].errormessage)
                            return console.log('weather error' + resultJSON.weatherdata.weather['A$'].errormessage);
                        if (!(resultJSON.weatherdata.weather instanceof Array)) {
                            return console.log('missing weather info');
                        }

                        var weatherLen = resultJSON.weatherdata.weather.length,
                            weatherItem;
                        for (var i = 0; i < weatherLen; i++) {

                            if (typeof resultJSON.weatherdata.weather[i]['A$'] !== 'object')
                                continue;

                            weatherItem = {
                                location: {
                                    name: resultJSON.weatherdata.weather[i]['A$']['weatherlocationname'],
                                    zipcode: resultJSON.weatherdata.weather[i]['A$']['zipcode'],
                                    lat: resultJSON.weatherdata.weather[i]['A$']['lat'],
                                    long: resultJSON.weatherdata.weather[i]['A$']['long'],
                                    timezone: resultJSON.weatherdata.weather[i]['A$']['timezone'],
                                    alert: resultJSON.weatherdata.weather[i]['A$']['alert'],
                                    degreetype: resultJSON.weatherdata.weather[i]['A$']['degreetype'],
                                    imagerelativeurl: resultJSON.weatherdata.weather[i]['A$']['imagerelativeurl']
                                },
                                current: null,
                                forecast: null
                            };

                            if (resultJSON.weatherdata.weather[i]['current'] instanceof Array && resultJSON.weatherdata.weather[i]['current'].length > 0) {
                                if (typeof resultJSON.weatherdata.weather[i]['current'][0]['A$'] === 'object') {
                                    weatherItem.current = resultJSON.weatherdata.weather[i]['current'][0]['A$'];

                                    weatherItem.current.imageUrl = weatherItem.location.imagerelativeurl + 'law/' + weatherItem.current.skycode + '.gif';
                                }
                            }

                            if (resultJSON.weatherdata.weather[i]['forecast'] instanceof Array) {
                                weatherItem.forecast = [];
                                for (var k = 0; k < resultJSON.weatherdata.weather[i]['forecast'].length; k++) {
                                    if (typeof resultJSON.weatherdata.weather[i]['forecast'][k]['A$'] === 'object')
                                        weatherItem.forecast.push(resultJSON.weatherdata.weather[i]['forecast'][k]['A$']);
                                }
                            }
                        }
                        result.push(weatherItem);

                        var cur = result[0].current;
                        var loc = result[0].location;
                        let tajm;
                        if (loc.timezone > 0) {
                            tajm = '+';
                            tajm += loc.timezone;
                        } else {
                            tajm = loc.timezone;
                        }

                        const weatherembed = new Discord.RichEmbed()
                            .setDescription(`**${cur.skytext}**`)
                            .setAuthor(`Weather for ${cur.observationpoint}`)
                            .setThumbnail(cur.imageUrl)
                            .setColor(0x00AE86)
                            .addField(`Timezone`, `UTC${loc.timezone}`, true)
                            .addField(`Temperature`, `${cur.temperature}°${loc.degreetype}`, true)
                            .addField(`Feels like`, `${cur.feelslike}°${loc.degreetype}`, true)
                            .addField(`Wind`, `${cur.winddisplay}`, true)
                            .addField(`Humidity`, `${cur.humidity}`, true);

                        msg.edit(weatherembed);
                        message.channel.stopTyping();
                    });
                });
            } catch (err) {
                if (err) message.reply(err);
                message.channel.stopTyping();
            }
        });
};

exports.cfg = {
    command: "weather",
    enabled: true,
    guildOnly: false,
    aliases: ['wet']
};
exports.help = {
    description: "Returns info about weather in specified city",
    usage: "weather [city] [C/F]",
    name: 'weather',
    show: true
};
