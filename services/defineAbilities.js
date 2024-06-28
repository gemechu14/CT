const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (role.name === 'admin') {
    can('manage', 'all'); // Full access
  } else {
    role.Permissions.forEach(permission => {
      can(permission.action, permission.subject);
    });
  }

  return build();
}

module.exports = defineAbilitiesFor;
