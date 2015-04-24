window.racing = window.racing || {};
window.racing.data = window.racing.data || {};

(function (racing) {

    // Base URI for Racing Game Table Storage data.
    var tableStorageBaseUrl = 'https://gabracinglab-secondary.table.core.windows.net/';

    // Enumeration of the three tracks in the racing game.
    var tracks = {
        beginner: 0,
        advanced: 1,
        expert: 2
    };

    // Table names and shared access signatures for racing game data.
    var auths = {
        rankingLapTimes: {
            tableName: 'RankingLapTimes',
            signature: 'SLh2mtxVKdPj5d3%2FiI%2FMY2ymsHG9cZaLcRtLE9Yhf3E%3D'
        },
        achievements: {
            tableName: 'Achievements',
            signature: 'n6oDZu69sYu5fzWXHSon4nhSVAvVPrqfYcLwEw%2FHnHg%3D'
        },
        tracks: [
            {
                playerLapTimes: {
                    tableName: 'PlayerLapTimes0',
                    signature: '4Ykj7chtVfgd7CclQiFOScLTllBvgMqKjWle0AZYZ8Y%3D'
                },
                telemetryData: {
                    tableName: 'TelemetryData0',
                    signature: 'Nkanfxp98yMunfBD1B%2BBdmWI73k2RRD3WysKK5zmGBY%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'RankingLapTimesCountryTrack0',
                    signature: 'Op2LIRuGot0fG1pnT%2FGtf7WoHJpcXyeas%2F0a221Yz9A%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'RankingLapTimesLocationTrack0',
                    signature: 'Ep7kjKkEb%2FQPksTVfkzo8XpLJdNuy%2FqEN36PvVS1cls%3D'
                }
            },
            {
                playerLapTimes: {
                    tableName: 'PlayerLapTimes1',
                    signature: '3WgWajGbb0gRphGArFxkEYO6XqbnDHdXxMgYUzpWgGQ%3D'
                },
                telemetryData: {
                    tableName: 'TelemetryData1',
                    signature: 'jfDTmVYaf8iHEnkeQPBfwMOwq70HdNnKEa5YIEWUTiY%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'RankingLapTimesCountryTrack1',
                    signature: 'yk6eICNAmwbBCnVsktGds4NvGwPxsU2Gs43G1fdyLmU%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'RankingLapTimesLocationTrack1',
                    signature: 'ytwlA64Y2rENEn7lp5wQhKEgRzh0AHVBBIcCv7Ry1og%3D'
                }
            },
            {
                playerLapTimes: {
                    tableName: 'PlayerLapTimes2',
                    signature: 'L4htRc30fD9tUlHOz9T%2BvryvRYO5%2BM2uAj0uw012rXs%3D'
                },
                telemetryData: {
                    tableName: 'TelemetryData2',
                    signature: '%2FzmiXwrnNRmd3nWn97lw80cbyK%2BpvFQJrKDXIPd6V3Y%3D'
                },
                rankingLapTimesCountryTrack: {
                    tableName: 'RankingLapTimesCountryTrack2',
                    signature: '9r7358UlPUrw4foyS%2FOxykFNdi5tJZ%2FCQmQqk1P4Uew%3D'
                },
                rankingLapTimesLocationTrack: {
                    tableName: 'RankingLapTimesLocationTrack2',
                    signature: '2U%2FP7UmzBTLiqWmgFbl22IZiqY4Fhs7yCtpWPiwzl6E%3D'
                }
            }
        ]
    };

    // Formats a query for a Table Storage partition.
    function getPartitionFilter(value, prefix) {
        var filter = {};
        prefix = prefix || '';
        if (typeof (value) !== 'undefined') {
            filter.partitionKey = prefix + value;
        }
        return filter;
    }


  
    // Sends a Get request to Table Storage, returning the JSON response.
    function getJson(url, successCallback, errorCallback) {

        // ToDo: Add code to get JSON data from a URI
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Accept', 'application/json');
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.response);
                successCallback(data);
            } else {
                errorCallback(this);
            }
        };

        request.onerror = function () {
            errorCallback(this);
        };

        request.send();

    }

    
    // Formats a URI for querying Table Storage using a Shared Access Signature
    function getTableStorageUrl(auth, fields, filter) {

        // ToDo: Add code to format a table storage URL with shared access signature
        var baseUrl = tableStorageBaseUrl
            + auth.tableName
            + '?tn=' + auth.tableName
            + '&sv=2014-02-14&si=GabLab'
            + '&sig=' + auth.signature;

        var filterUrl = '';
        var fieldsUrl = '';

        if (filter && typeof (filter.partitionKey) != 'undefined') {
            filterUrl = "&$filter=PartitionKey eq '" + filter.partitionKey + "'";
        }

        if (fields && fields.length) {
            fieldsUrl = "&$select=" + fields.join(',');
        }

        return baseUrl + fieldsUrl + filterUrl;

    }



    // Queries Table Storage and retrieves the data.
    function getTableStorageData(auth, successCallback, fields, filter) {

        // ToDo: Add code to get data from a Table Storage table
        var url = getTableStorageUrl(auth, fields, filter);
        getJson(url, function (data) {
            successCallback(data.value);
        }, function (error) {
            console.error(error);
        });

    }



    // Creates an object for retrieving data for a specified track.
    function getTrack(track) {
        return {

            // ToDo: Add code to get data for the specific location
            getRankingLapTimesByLocation: function (successCallback, fields, locationId) {
                var filter = getPartitionFilter(locationId);
                getTableStorageData(auths.tracks[track].rankingLapTimesLocationTrack,
                    successCallback, fields, filter);
            },


            // ToDo: Add code to get data for the specific country
            getRankingLapTimesByCountry: function (successCallback, fields, countryCode) {
                var filter = getPartitionFilter(countryCode);
                getTableStorageData(auths.tracks[track].rankingLapTimesCountryTrack,
                    successCallback, fields, filter);
            },

            // ToDo: Add code to get the telemetry data for a specific lap


        };
    }



    racing.data.getAchievements = function (successCallback, fields, countryCode) {

        // ToDo: Add code to get the player achievements for your country


    };



    // Create the objects for the three tracks.
    racing.data.beginnerTrack = getTrack(tracks.beginner);
    racing.data.advancedTrack = getTrack(tracks.advanced);
    racing.data.expertTrack = getTrack(tracks.expert);

}(window.racing));