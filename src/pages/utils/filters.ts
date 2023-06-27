export function getOperatorSymbol(operator: string) {
  switch (operator) {
    case '=':
      return 'equals'
    case '!=':
      return 'notEquals'
    case '>':
      return 'greaterThan'
    case '>=':
      return 'greaterThanOrEquals'
    case '<':
      return 'lessThan'
    case '<=':
      return 'lessThanOrEquals'
    case 'contém':
      return 'contains'
    case 'não contém':
      return 'notContains'
    default:
      return ''
  }
}
