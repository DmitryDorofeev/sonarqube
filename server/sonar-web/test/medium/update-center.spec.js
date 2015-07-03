define(function (require) {
  var bdd = require('intern!bdd');
  require('../helpers/test-page');

  bdd.describe('Update Center Page', function () {
    bdd.it('should show plugin card', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?1'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 5)
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-name', 'Git')
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-category', 'Integration')
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-description', 'Git SCM Provider.')
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-installed-version', '1.0')
          .checkElementCount('li[data-id="scmgit"] .js-update-version', 1)
          .checkElementInclude('li[data-id="scmgit"] .js-update-version', '1.1')
          .checkElementCount('li[data-id="scmgit"] .js-changelog', 1)
          .checkElementCount('li[data-id="scmgit"] .js-plugin-homepage', 1)
          .checkElementCount('li[data-id="scmgit"] .js-plugin-issues', 1)
          .checkElementNotExist('li[data-id="scmgit"] .js-plugin-terms')
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-license', 'GNU LGPL 3')
          .checkElementInclude('li[data-id="scmgit"] .js-plugin-organization', 'SonarSource')
          .checkElementCount('li[data-id="scmgit"] .js-update', 1)
          .checkElementCount('li[data-id="scmgit"] .js-uninstall', 1)
          .checkElementNotExist('li[data-id="scmgit"] .js-install');
    });

    bdd.it('should show system update', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?2#updates'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromFile('/api/system/upgrades', 'update-center-spec/system-updates.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-system]', 1)
          .checkElementInclude('li[data-system] .js-plugin-name', 'SonarQube 5.3')
          .checkElementInclude('li[data-system] .js-plugin-category', 'System Update')
          .checkElementInclude('li[data-system] .js-plugin-description', 'New!')
          .checkElementCount('li[data-system] .js-plugin-release-notes', 1)
          .checkElementCount('li[data-system] .js-plugin-date', 1)
          .checkElementCount('li[data-system] .js-plugin-update-steps', 1)
          .checkElementCount('li[data-system] .js-plugin-update-steps > li', 4);
    });

    bdd.it('should show installed', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?3#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 5)
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementExist('li[data-id="javascript"]');
    });

    bdd.it('should show updates', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?4#updates'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromFile('/api/system/upgrades', 'update-center-spec/system-updates.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 4)
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementNotExist('li[data-id="javascript"]');
    });

    bdd.it('should show available', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?5#available'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/available', 'update-center-spec/available.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 3)
          .checkElementNotExist('li[data-id="scmgit"]')
          .checkElementExist('li[data-id="abap"]');
    });

    bdd.it('should switch between views', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?6#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromFile('/api/plugins/available', 'update-center-spec/available.json')
          .mockFromFile('/api/system/upgrades', 'update-center-spec/system-updates.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 5)
          .checkElementExist('li[data-id="javascript"]')
          .checkElementExist('#update-center-filter-installed:checked')
          .clickElement('[for="update-center-filter-available"]')
          .checkElementExist('li[data-id="abap"]')
          .checkElementCount('li[data-id]', 3)
          .checkElementExist('li[data-id="abap"]')
          .checkElementExist('#update-center-filter-available:checked')
          .clickElement('[for="update-center-filter-updates"]')
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementCount('li[data-id]', 4)
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementExist('#update-center-filter-updates:checked')
          .clickElement('[for="update-center-filter-installed"]')
          .checkElementExist('li[data-id="javascript"]')
          .checkElementCount('li[data-id]', 5)
          .checkElementExist('li[data-id="javascript"]')
          .checkElementExist('#update-center-filter-installed:checked')
          .clickElement('[for="update-center-filter-available"]')
          .checkElementExist('li[data-id="abap"]')
          .checkElementCount('li[data-id]', 3)
          .checkElementExist('li[data-id="abap"]')
          .checkElementExist('#update-center-filter-available:checked')
          .clickElement('[for="update-center-filter-updates"]')
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementCount('li[data-id]', 4)
          .checkElementExist('li[data-id="scmgit"]')
          .checkElementExist('#update-center-filter-updates:checked');
    });

    bdd.it('should search', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?7#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementCount('li[data-id]', 5)
          .checkElementNotExist('li.hidden[data-id]')
          .fillElement('#update-center-search-query', 'jA')
          .clickElement('#update-center-search-submit')
          .checkElementExist('li.hidden[data-id]')
          .checkElementCount('li[data-id]', 5)
          .checkElementCount('li.hidden[data-id]', 3)
          .checkElementInclude('li:not(.hidden)[data-id] .js-plugin-name', 'JavaScript');
    });

    bdd.it('should show plugin changelog', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?8#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .clickElement('li[data-id="python"] .js-changelog')
          .checkElementExist('.bubble-popup')
          .checkElementCount('.bubble-popup .js-plugin-changelog-version', 2)
          .checkElementCount('.bubble-popup .js-plugin-changelog-date', 2)
          .checkElementCount('.bubble-popup .js-plugin-changelog-link', 2)
          .checkElementCount('.bubble-popup .js-plugin-changelog-description', 2);
    });

    bdd.it('should update plugin', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?9#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromString('/api/plugins/update', '{}', { data: { key: 'scmgit' } })
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .clickElement('li[data-id="scmgit"] .js-update')
          .checkElementNotExist('li[data-id="scmgit"] .js-spinner')
          .checkElementInclude('li[data-id="scmgit"]', 'To Be Installed');
    });

    bdd.it('should uninstall plugin', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?10#installed'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/installed', 'update-center-spec/installed.json')
          .mockFromFile('/api/plugins/updates', 'update-center-spec/updates.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromString('/api/plugins/uninstall', '{}', { data: { key: 'scmgit' } })
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .clickElement('li[data-id="scmgit"] .js-uninstall')
          .checkElementNotExist('li[data-id="scmgit"] .js-spinner')
          .checkElementInclude('li[data-id="scmgit"]', 'To Be Uninstalled');
    });

    bdd.it('should install plugin', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?11#available'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/available', 'update-center-spec/available.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromString('/api/plugins/install', '{}', { data: { key: 'abap' } })
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .clickElement('li[data-id="abap"] .js-install')
          .checkElementNotExist('li[data-id="abap"] .js-spinner')
          .checkElementInclude('li[data-id="abap"]', 'To Be Installed');
    });

    bdd.it('should cancel all pending', function () {
      return this.remote
          .get(require.toUrl('test/medium/base.html?12#available'))
          .mockFromString('/api/l10n/index', '{}')
          .mockFromFile('/api/plugins/available', 'update-center-spec/available.json')
          .mockFromFile('/api/plugins/pending', 'update-center-spec/pending.json')
          .mockFromString('/api/plugins/cancel_all', '{}')
          .startApp('update-center', { urlRoot: '/test/medium/base.html' })
          .checkElementExist('.js-plugin-name')
          .checkElementExist('.js-pending')
          .clickElement('.js-cancel-all')
          .checkElementNotExist('.js-pending');
    });
  });
});
