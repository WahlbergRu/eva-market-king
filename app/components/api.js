/**
* Created by Allen Wahlberg on 04.10.2015.
*/

//Все методы связанные с получением и отправкой даты находятся здесь

app
.factory('api', ['$http', '$location', '$q', '$timeout'
        , function($http, $location, $q, $timeout){
    //Метод запроса на сервер, если 200, 201 или 204 статус то возвращает в resolve, иначе reject.
    //reject используется во второй функции колбека, метода .then()

    var requestKeys = {};

    //var scope = $rootScope.$new(true);
    //scope.requestKeys = {};

    function request(method, url, data, deferred, requestCount) {
        var maxRequestCount = 5;

        if ( !deferred ) deferred = $q.defer();

        if ( !requestCount ) requestCount = 1;

        //console.log(config.BASIC_URL + config.ADMIN_SERVICE_DEV + config.API + url)
        $http({
            method: method,
            url: 'https://public-crest.eveonline.com/' + url + '/',
            data: data
        }).success(function (response, status, headers, config) {
            if (status === 200 || status === 201 || status === 204) {
                if ( response.Errors && response.Errors.length ) {

                    response.Errors.forEach(function(value) {
                        toastr.error(value.UserMessage);
                    });

                    deferred.reject(response, status, headers, config);
                } else {

                    //if ( response.BusinessData == undefined ) response.BusinessData = response;

                    deferred.resolve(response, status, headers, config);
                }

            } else {
                if ( status === 401 ) {
                    deferred.reject(response, status, headers, config);
                    return;
                }
                if ( requestCount < maxRequestCount ) {
                    requestCount++;
                    //toastr.error('Соединение с сервером прервано. Идет повторная попытка.');
                    $timeout(function() {
                        request(method, url, data, deferred, requestCount);
                    },2000);
                } else {
                    toastr.error('Невозможно соединиться с сервером.');
                    deferred.reject(response, status, headers, config);
                }
            }
        }).error(function (response, status, headers, config) {
            //TODO: Добавить нотифейшины сюда(опцианально);
            toastr.error('response');
            toastr.error(response.message);
            deferred.reject(response, status, headers, config);
        });

        return deferred.promise;
    }




    //Данные от метода в зависимости от url'a

    function switchMethod(method, url, data, uniqueParams){

        switch (method){
            case 'get':
                var addUrl;
                if (data){
                    addUrl = '?';
                    addUrl += Object.keys(data).map(function(key){
                        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                    }).join('&');
                } else {
                    addUrl = '';
                }

                url = url + addUrl;
                return request(method, url, null);
                break;
            case 'post':
                return request(method, url, data);
                break;
            case 'blob':
                return requestBlob(method, url, data);
                break;
            case 'update':
                return request(method, url, data);
                break;
            case 'options':
                return request(method, url, null);
                break;
            case 'delete':
                return request(method, url, data);
                break;
            case 'postAndBlob':
                return requestPostAndBlob(method, url, data);
                break;
            case 'postUnique':
                return requestPostUnique(method, url, data, uniqueParams);
                break;
            default: break;
        }
    }

    // Методы фактори api
    // Использовать как api.requests (или другой объект. Возвращает набор функции фактори
    return {
        universal: function(method, url, data){return switchMethod(method, url, data)},
        map: function(method, url, data){return switchMethod(method, '/', data)},
    }

}]);
