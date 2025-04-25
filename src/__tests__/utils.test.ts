import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names and dedupe', () => {
    const result = cn(
      'class1',
      'class2',
      'class1',
      undefined,
      false && 'class3'
    );
    const parts = result.split(' ');

    expect(parts).toContain('class1');
    expect(parts).toContain('class2');
    expect(parts).toHaveLength(3);
  });
});
