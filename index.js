/**
 * Created by mschwartz on 7/18/14.
 */

/*global require, JSON */
var http = require('http');

function MailChimp( apiKey ) {
    var [key,host] = apiKey.split('-');
    this.host = host;
    this.apiKey = apiKey;
    this.url = 'https://' + this.host + '.api.mailchimp.com/2.0/';
}
decaf.extend(MailChimp.prototype, {
    post           : function( method, o ) {
        o = o || {};
        o.apikey = this.apiKey;
        return JSON.parse(new http.Client(this.url + method + '.json')
            .post(JSON.stringify(o)).responseText);
    },
    lists: function(name) {
        if (name) {
            return this.post('/lists/list', {
                filters: {
                    list_name: name,
                    exact: true
                }
            });
        }
        else {
            return this.post('/lists/list');
        }
    },
    batchSubscribe : function( id, batch, double_optin, update_existing, replace_interests ) {
        if (double_optin === undefined) {
            double_optin = false;
        }
        if (update_existing === undefined) {
            update_existing = true;
        }
        if (replace_interests === undefined) {
            replace_interests = true;
        }
        if (!id) {
            throw new Error('No list Id provided to MailChimp.batchSubscribe');
        }
        if (!batch) {
            throw new Error('No batch array provided to MailChimp.batchSubscribe');
        }
        if (!decaf.isArray(batch)) {
            batch = [ batch ];
        }

        return this.post('/lists/batch-subscribe', {
            id: id,
            batch: batch,
            double_optin: double_optin,
            update_existing: update_existing,
            replace_interests: replace_interests
        });
    },
    batchUnsubscribe: function(id, batch) {
        console.dir(batch);
        return this.post('/lists/batch-unsubscribe', {
            id: id,
            batch: batch
        });
    },
    subscribe: function(id, email) {
        if (decaf.isString(email)) {
            email = {
                email: email
            };
        }
        return this.post('/lists/subscribe', {
            id: id,
            email: email
        });
    },
    unsubscribe: function(id, email) {
        if (decaf.isString(email)) {
            email = {
                email: email
            };
        }
        return this.post('/lists/unsubscribe', {
            id: id,
            email: email
        });
    }
});

module.exports = MailChimp;
