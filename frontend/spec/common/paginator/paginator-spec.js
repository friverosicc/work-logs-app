'use strict';

describe('Paginator', function() {
    var paginator;

    beforeEach(module('demo-app.common.paginator'));
    beforeEach(inject(function (_paginator_) {
        paginator = _paginator_;
    }));

    it('should initialize the paginator with range < total', function() {
        paginator.init(0, 15, 100);

        expect(paginator.getEnd()).toBe(15);
    });

    it('should initialize paginator with range > total', function() {
        paginator.init(0, 15, 5);

        expect(paginator.getEnd()).toBe(5);
    });

    it('should set total equal zero and reset to zero the start and end value', function() {
        paginator.init(15, 30, 100);

        paginator.setTotal(0);

        expect(paginator.getEnd()).toBe(0);
        expect(paginator.getStart()).toBe(0);
    });

    it('should set total > 0 with range < total and end == 0', function() {
        paginator.init(0, 15, 0);

        paginator.setTotal(100);

        expect(paginator.getEnd()).toBe(15);
    });

    it('should set total > 0 with range > total or end == 0', function() {
        paginator.init(0, 15, 0);

        paginator.setTotal(10);

        expect(paginator.getEnd()).toBe(10);
    });

    it('should set total > 0 with range >= total and (end - range) < total', function() {
        paginator.init(0, 15, 0);

        paginator.setTotal(10);
        paginator.setTotal(13);

        expect(paginator.getEnd()).toBe(13);
    });

    it('should set total > range and then change the total to < range and > to range again', function() {
        paginator.init(0, 15, 0);

        paginator.setTotal(19);
        paginator.setTotal(1);
        paginator.setTotal(19);

        expect(paginator.getEnd()).toBe(15);
    });

    it('should go to the next page', function() {
        paginator.init(0, 15, 100);

        paginator.nextPage();

        expect(paginator.getStart()).toBe(15);
        expect(paginator.getEnd()).toBe(30);
    });

    it('should go to the next page with (total - end) < range', function() {
        paginator.init(0, 15, 17);

        paginator.nextPage();

        expect(paginator.getStart()).toBe(15);
        expect(paginator.getEnd()).toBe(17);
    });

    it('should go to the next page with (start + range) >= total', function() {
        paginator.init(15, 15, 100);

        paginator.setTotal(20);
        paginator.nextPage();

        expect(paginator.getStart()).toBe(15);
        expect(paginator.getEnd()).toBe(20);
    });

    it('should go to the next page with total = 0', function() {
        paginator.init(0, 15, 0);

        paginator.nextPage();

        expect(paginator.getStart()).toBe(0);
        expect(paginator.getEnd()).toBe(0);
    });

    it('should go to the previous page', function() {
        paginator.init(15, 15, 100);

        paginator.previousPage();

        expect(paginator.getStart()).toBe(0);
        expect(paginator.getEnd()).toBe(15);
    });

    it('should go to the previous page with (end - start) < range', function() {
        paginator.init(15, 15, 20);

        paginator.previousPage();

        expect(paginator.getStart()).toBe(0);
        expect(paginator.getEnd()).toBe(15);
    });

    it('should go to the previous page with (end - start) < range and _start == 0', function() {
        paginator.init(0, 15, 20);

        paginator.previousPage();

        expect(paginator.getStart()).toBe(0);
        expect(paginator.getEnd()).toBe(15);
    });

    it('should go to the previous page with total < range', function() {
        paginator.init(0, 15, 13);

        paginator.previousPage();

        expect(paginator.getStart()).toBe(0);
        expect(paginator.getEnd()).toBe(13);
    });

    it('should go to the las page', function() {
        paginator.init(0, 15, 20);

        paginator.lastPage();

        expect(paginator.getStart()).toBe(15);
        expect(paginator.getEnd()).toBe(20);
    });

    it('should return the paginator label', function() {
        paginator.init(45, 15, 230);

        expect(paginator.getLabel()).toBe('46 - 60 of 230');
    });

    it('should return the paginator label with start+1 > total', function() {
        paginator.init(30, 15, 30);

        expect(paginator.getLabel()).toBe('30 - 30 of 30');
    });

    it('should next page be disabled', function() {
        paginator.init(0, 15, 10);

        expect(paginator.isNextPageDisabled()).toBeTruthy();
    });

    it('should next page be enabled', function() {
        paginator.init(0, 15, 30);

        expect(paginator.isNextPageDisabled()).toBeFalsy();
    });

    it('should previous page be disabled', function() {
        paginator.init(0, 15, 10);

        expect(paginator.isPreviousPageDisabled()).toBeTruthy();
    });

    it('should previous page be enabled', function() {
        paginator.init(30, 15, 30);

        expect(paginator.isPreviousPageDisabled()).toBeFalsy();
    });

    it('should init without data', function() {
        paginator.init(0, 15, 0);

        expect(paginator.getLabel()).toEqual("0 - 0 of 0");
    });
});
