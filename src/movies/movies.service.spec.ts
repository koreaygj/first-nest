import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Server } from 'http';
import { NotFoundException } from '@nestjs/common';
import exp from 'constants';
import { execPath } from 'process';

describe('MovieService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test',
        genres: ['test'],
        year: 2022,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('should 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeOne', () => {
    it('remove movie', () => {
      service.create({
        title: 'Test',
        genres: ['test'],
        year: 2022,
      });
      const allMovies = service.getAll();
      service.removeOne(1);
      const afterRemove = service.getAll();
      expect(afterRemove.length).toEqual(allMovies.length - 1);
      try {
        service.removeOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('create movie', () => {
      const allMovies = service.getAll().length;
      service.create({
        title: 'Test',
        genres: ['test'],
        year: 2022,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(allMovies);
    });
  });

  describe('update', () => {
    it('should return a updated movie', () => {
      service.create({
        title: 'Test',
        genres: ['test'],
        year: 2022,
      });
      service.update(1, {
        title: 'fixed',
      });
      const result = service.getOne(1);
      expect(result.title).toEqual('fixed');
    });
    it('should throw NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
