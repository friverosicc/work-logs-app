(function() {
    'use strict';

    angular.module('demo-app.common.paginator', [])
    .factory('paginator', [
        function() {
            var _total = 0;
            var _range = 0;
            var _start = 0;
            var _end = 0;

            function init(start, range, total) {
                _total = total;
                _range = range;
                _start = start;

                if(_start === 0)
                    _end = (_total < _range) ? _total : range;
                else
                    _end = ((_start + _range) > _total) ? _total : _start + _range;
            }

            function setTotal(total) {
                _total = total;

                if(total === 0) {
                    _start = 0;
                    _end = 0;
                }

                if(_range <= total && _end === 0) {
                    _end = _range;
                } else {
                    if(_end > _total || _end === 0)
                        _end = _total;
                    if(_range >= _total && (_end - _range) < _total)
                        _end = total;
                }
            }

            function nextPage() {
                _start += _range;
                _end += _range;

                if(_start >= _total)
                    if(_total === 0)
                        _start = 0;
                    else
                        _start -= _range;

                if(_end > _total)
                    _end = _total;
            }

            function previousPage() {
                var diff = _end - _start;
				_start -= _range;

				if(diff < _range)
					_end -= diff;
				else
					_end -= _range;

				if(_start < 0)
					_start = 0;

				if(_end > 0) {
					if(_end < _range) {
						if(_total === 0)
							_end = 0;
						else
							_end = _range;
					}
				} else {
					if(_total < _range)
						_end += _total;
					else
						_end += _range;
				}

            }

            function lastPage() {
                _start = Math.floor(_total/_range) * _range;
                _end = _total;
            }

            function isNextPageDisabled() {
                return _end === _total;
            }

            function isPreviousPageDisabled() {
                return _start <= 0;
            }

            function getLabel() {
                var aux = _start + 1;

                if(aux > _total)
                    aux = _total;

                return aux + ' - ' + _end + ' of ' + _total;
            }

            function getEnd() {
                return _end;
            }

            function getStart() {
                return _start;
            }

            function getRange() {
                return _range;
            }

            return {
                init: init,
                setTotal: setTotal,
                nextPage: nextPage,
                previousPage: previousPage,
                lastPage: lastPage,
                isNextPageDisabled: isNextPageDisabled,
                isPreviousPageDisabled: isPreviousPageDisabled,
                getLabel: getLabel,
                getEnd: getEnd,
                getStart: getStart,
                getRange: getRange
            };
        }
    ]);
})();
