define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var argumentos;
    var camposDE = [];
    var camposSelected = [];

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema');
    }

    function initialize(data) {


        $('#my-select').multiSelect({
            afterSelect: function (values) {
                camposSelected.push(values)
            },
            afterDeselect: function (values) {
                var index = camposSelected.indexOf(values);
                camposSelected.splice(index, 1)
            }
        });



        console.log(data);
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                alert('VALUE-> ' + val)
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

        connection.on('requestedSchema', function (data) {
            // save schema
            console.log('*** Schema ***', JSON.stringify(data['schema']));
            var JsonParsed = data['schema'];
            var key;
            for (var i = 0, len = data['schema'].length; i < len; ++i) {
                key = JsonParsed[i].key;
                camposDE.push(key.substr(key.lastIndexOf(".") + 1));
            }
            camposDE.forEach(function (campo) {
                console.log("CAMPO DA DATA EXTENSION -> " + campo);
                $('#my-select').multiSelect('addOption', { value: campo, text: campo, index: 0, nested: 'optgroup_label' });
            });
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }


    function save() {
        var name = 'API Exemplo Sonae';
        var endpointValue = $('#endpoint-url').val();
        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
        payload.name = name;
        //var argumentos = "[{";

        /*   camposDE.forEach(function(campo) {
               console.log("CAMPO DA DATA EXTENSION -> " + campo);
               arguments = arguments + "\"campo\": '{{Contact.Attribute.De_DEV.Password}}
               $('#my-select').multiSelect('addOption', { value: campo, text: campo, index: 0, nested: 'optgroup_label' });
           });*/

        payload['arguments'].execute.inArguments = [{
            "Definition-id": '{{Context.DefinitionId}}',
            "Endpoint": endpointValue,
            "User": "{{Contact.Key}}",
            "Email": '{{InteractionDefaults.Email}}',
            "Nome": "{{Event.23c8346be5-f6b2-40f9-9bcd-8cc514b26d90.Nome}}"
        }];

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }


});