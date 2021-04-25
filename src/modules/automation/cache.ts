import { AtomCache } from '../../generic/supply/atom-cache';
import { Atom } from '@grammarly/focal';
import { createFig } from '../../generic/supply/atom-helpers';
import { defer } from 'rxjs';
import { tachka } from '../shell/tachkaClient';
import { IAutomationDefinitions } from '../api-tachka/types/automation';

const defaultValue: IAutomationDefinitions = {};

export const cacheDefinitions$ = new AtomCache<IAutomationDefinitions>({
  fig$: Atom.create(createFig({ value: defaultValue })),
  shouldLoad: (value) => value === defaultValue,
  getValue$: defer(() => tachka.automationInstanceDefinitions()),
});
