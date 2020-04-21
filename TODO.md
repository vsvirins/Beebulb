## TODO


### Non-code

- [ ] Re-write README
- [ ] License
- [ ] Credit


### General

- [x] Toggle all lights on/off
- [ ] Check if all lights are off/on 
- [ ] Detect dark mode
- [ ] Make light mode look good
- [ ] User change background?
- [ ] Modulize store
- [ ] Hack knob / create new knob (fix 0-max brightness jump)
- [x] Make presetbutton fixed
- [x] Some kind of communication error warning
- [ ] Migrate to TopBar component group
- [ ] Remove unused stuff
- [ ] Make new component from preset icons


### Bugs

- [x] Fix state problem when closing config menu
- [x] Remove buggy draggable from groups
- [x] Fix compatibility issues with chrome android
- [x] Fix unreachable icon overflow


### Configs

###### Lights
---

- [x] LightConfig dialog
- [x] Add light to group
- [x] Remove light from group
- [ ] Scan for new lights
- [ ] Identify new lights
- [ ] Rename new lights
- [ ] Assign new lights to group
- [ ] Add color support

###### Groups
---

- [x] GroupsConfig dialog
- [x] New group
- [x] Remove group
- [x] Rename group
- [ ] Check if groupname exsist before adding new group
- [ ] Rearrange groups
- [ ] Edit icon

###### Presets
---

- [x] PresetsConfig dialog
- [x] Create preset
- [x] Delete preset
- [x] Change presets icons
- [x] Color picker for presets

###### Gateway
---

- [x] GatewayConfig dialog
- [x] 'Gateway not found'
- [x] Gateway info dialog
- [x] Change gateway name
- [ ] Change password promt if user not found(default: delight)
- [ ] Auth new user(promt for password)
- [ ] Auth new app (timed unlock)


### Live demo

- [ ] Dummie gateway
- [ ] Demo app


### Flask+SQLite backend

- [x] Register user
- [x] Login user
- [x] Store deCONZ API key
- [x] Get deCONZ API key
- [x] Save presets
- [ ] Remember user
- [ ] Save group order
- [ ] Containerize
