import { convertFormDataToFilters, mergeFormDataWithFilters } from '../query-converter';

describe('Query Converter', () => {
  describe('convertFormDataToFilters', () => {
    it('should flatten nested metadata fields using dot notation', () => {
      const formData = {
        metadata: {
          title: 'Test Dataset',
          solvent: 'water',
          concentration: 50,
          temperature: {
            min: 20,
            max: 30
          }
        },
        schema: 'schema-123'
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.title': 'Test Dataset',
        'metadata.solvent': 'water',
        'metadata.concentration': 50,
        'metadata.temperature': { $gte: 20, $lte: 30 },
        'schema': 'schema-123'
      });
    });

    it('should handle deeply nested metadata structures', () => {
      const formData = {
        metadata: {
          experimental: {
            conditions: {
              pressure: 1.0,
              humidity: 60
            },
            results: {
              yield: 85,
              purity: 95
            }
          }
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.experimental.conditions.pressure': 1.0,
        'metadata.experimental.conditions.humidity': 60,
        'metadata.experimental.results.yield': 85,
        'metadata.experimental.results.purity': 95
      });
    });

    it('should handle array values correctly', () => {
      const formData = {
        metadata: {
          tags: ['organic', 'synthesis', 'catalysis'],
          authors: ['Smith', 'Johnson']
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.tags': { $in: ['organic', 'synthesis', 'catalysis'] },
        'metadata.authors': { $in: ['Smith', 'Johnson'] }
      });
    });

    it('should handle matrix/2D arrays correctly', () => {
      const formData = {
        metadata: {
          pressure_matrix: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
          ]
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.pressure_matrix': [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 0]
        ]
      });
    });

    it('should handle complex field names with special characters', () => {
      const formData = {
        simulation_level_data: {
          inputrec: {
            'ref-p (3x3)': [
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0]
            ]
          }
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'simulation_level_data.inputrec.ref-p (3x3)': [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 0]
        ]
      });
    });

    it('should handle date ranges correctly', () => {
      const formData = {
        metadata: {
          experiment_date: {
            from: new Date('2023-01-01'),
            to: new Date('2023-12-31')
          }
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.experiment_date': {
          $gte: new Date('2023-01-01'),
          $lte: new Date('2023-12-31')
        }
      });
    });

    it('should handle numeric ranges correctly', () => {
      const formData = {
        metadata: {
          concentration: {
            min: 0,
            max: 100
          }
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.concentration': {
          $gte: 0,
          $lte: 100
        }
      });
    });

    it('should skip undefined, null, and empty string values', () => {
      const formData = {
        metadata: {
          title: 'Valid Title',
          description: '',
          notes: null,
          tags: undefined,
          valid_field: 'valid'
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.title': 'Valid Title',
        'metadata.valid_field': 'valid'
      });
    });

    it('should handle mixed data types correctly', () => {
      const formData = {
        metadata: {
          string_field: 'test',
          number_field: 42,
          boolean_field: true,
          nested: {
            deep_field: 'deep value'
          }
        }
      };

      const result = convertFormDataToFilters(formData);

      expect(result).toEqual({
        'metadata.string_field': 'test',
        'metadata.number_field': 42,
        'metadata.boolean_field': true,
        'metadata.nested.deep_field': 'deep value'
      });
    });
  });

  describe('mergeFormDataWithFilters', () => {
    it('should merge forms data with existing filters', () => {
      const formsData = {
        metadata: {
          title: 'New Title',
          solvent: 'ethanol'
        }
      };

      const existingFilters = {
        schema: 'schema-123',
        'metadata.old_field': 'old value'
      };

      const result = mergeFormDataWithFilters(formsData, existingFilters);

      expect(result).toEqual({
        schema: 'schema-123',
        'metadata.old_field': 'old value',
        'metadata.title': 'New Title',
        'metadata.solvent': 'ethanol'
      });
    });

    it('should override existing filters with new forms data', () => {
      const formsData = {
        metadata: {
          title: 'Updated Title'
        }
      };

      const existingFilters = {
        'metadata.title': 'Old Title',
        'metadata.solvent': 'water'
      };

      const result = mergeFormDataWithFilters(formsData, existingFilters);

      expect(result).toEqual({
        'metadata.title': 'Updated Title',
        'metadata.solvent': 'water'
      });
    });
  });
});
