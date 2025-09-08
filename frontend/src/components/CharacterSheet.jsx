import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { X, Plus, Trash2, Upload, Dice6 } from 'lucide-react';
import { useBattleMapStore } from '../store/battleMapStore';

const CharacterSheet = ({ token, onClose }) => {
  const { updateToken, addChatMessage } = useBattleMapStore();
  const [activeTab, setActiveTab] = useState('summary');

  const handleUpdateToken = (updates) => {
    updateToken(token.id, updates);
  };

  const rollAction = (action) => {
    if (action.roll) {
      // Simple dice rolling - can be expanded
      const rollResult = Math.floor(Math.random() * 20) + 1;
      addChatMessage({
        type: 'roll',
        who: token.name,
        text: `${action.name}: ${rollResult}`,
        formula: action.roll,
        result: rollResult
      });
    }
  };

  const castSpell = (spell, level) => {
    const spellSlots = token.spellSlots || {};
    const levelSlots = spellSlots[level] || { used: 0, max: 0 };
    
    if (levelSlots.used < levelSlots.max) {
      // Use spell slot
      const newSlots = {
        ...spellSlots,
        [level]: { ...levelSlots, used: levelSlots.used + 1 }
      };
      handleUpdateToken({ spellSlots: newSlots });
      
      addChatMessage({
        type: 'spell',
        who: token.name,
        text: `Cast ${spell.name} (Level ${level})`
      });
    }
  };

  return (
    <Card className="w-96 bg-gray-800 border-gray-700 text-white h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{token.name}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-700">
            <TabsTrigger value="summary" className="text-xs">Stats</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
            <TabsTrigger value="spells" className="text-xs">Spells</TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>
          
          <div className="p-4 h-full overflow-y-auto">
            <TabsContent value="summary" className="space-y-4">
              {/* Portrait Upload */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-2">
                  {token.portrait ? (
                    <img src={token.portrait} alt="Portrait" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`portrait-${token.id}`}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => handleUpdateToken({ portrait: e.target.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`portrait-${token.id}`).click()}
                >
                  Upload Portrait
                </Button>
              </div>

              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>AC</Label>
                  <Input
                    type="number"
                    value={token.ac || ''}
                    onChange={(e) => handleUpdateToken({ ac: parseInt(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label>Speed</Label>
                  <Input
                    value={token.speed || ''}
                    onChange={(e) => handleUpdateToken({ speed: e.target.value })}
                    placeholder="30 ft"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              {/* HP */}
              <div>
                <Label>Hit Points</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={token.hp?.current || ''}
                    onChange={(e) => handleUpdateToken({
                      hp: { ...token.hp, current: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Current"
                    className="bg-gray-700 border-gray-600"
                  />
                  <span className="self-center">/</span>
                  <Input
                    type="number"
                    value={token.hp?.max || ''}
                    onChange={(e) => handleUpdateToken({
                      hp: { ...token.hp, max: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Max"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              {/* Passive Perception */}
              <div>
                <Label>Passive Perception</Label>
                <Input
                  type="number"
                  value={token.passivePerception || ''}
                  onChange={(e) => handleUpdateToken({ passivePerception: parseInt(e.target.value) || 0 })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Actions</h3>
                <Button size="sm" onClick={() => {
                  const newAction = {
                    id: Date.now().toString(),
                    name: 'New Action',
                    type: 'action',
                    roll: '1d20',
                    desc: ''
                  };
                  const actions = token.actions || [];
                  handleUpdateToken({ actions: [...actions, newAction] });
                }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {(token.actions || []).map((action) => (
                  <Card key={action.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Input
                            value={action.name}
                            onChange={(e) => {
                              const actions = token.actions.map(a =>
                                a.id === action.id ? { ...a, name: e.target.value } : a
                              );
                              handleUpdateToken({ actions });
                            }}
                            className="font-medium mb-2 bg-gray-600 border-gray-500"
                          />
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={action.roll || ''}
                              onChange={(e) => {
                                const actions = token.actions.map(a =>
                                  a.id === action.id ? { ...a, roll: e.target.value } : a
                                );
                                handleUpdateToken({ actions });
                              }}
                              placeholder="1d20+5"
                              className="bg-gray-600 border-gray-500 text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => rollAction(action)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Dice6 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={action.desc || ''}
                            onChange={(e) => {
                              const actions = token.actions.map(a =>
                                a.id === action.id ? { ...a, desc: e.target.value } : a
                              );
                              handleUpdateToken({ actions });
                            }}
                            placeholder="Action description..."
                            className="bg-gray-600 border-gray-500 text-sm"
                            rows={2}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const actions = token.actions.filter(a => a.id !== action.id);
                            handleUpdateToken({ actions });
                          }}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="spells" className="space-y-4">
              {/* Spell Slots */}
              <div>
                <h3 className="font-semibold mb-2">Spell Slots</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                    const slots = token.spellSlots?.[level] || { used: 0, max: 0 };
                    return (
                      <div key={level} className="text-center">
                        <div className="text-xs text-gray-400">Level {level}</div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newSlots = {
                                ...token.spellSlots,
                                [level]: { ...slots, used: Math.max(0, slots.used - 1) }
                              };
                              handleUpdateToken({ spellSlots: newSlots });
                            }}
                          >
                            -
                          </Button>
                          <span className="text-sm">{slots.used}/{slots.max}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newSlots = {
                                ...token.spellSlots,
                                [level]: { ...slots, used: Math.min(slots.max, slots.used + 1) }
                              };
                              handleUpdateToken({ spellSlots: newSlots });
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spells List */}
              <div>
                <h3 className="font-semibold mb-2">Spells</h3>
                <div className="space-y-2">
                  {(token.spells || []).map((spell) => (
                    <Card key={spell.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{spell.name}</div>
                            <div className="text-sm text-gray-400">Level {spell.level}</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => castSpell(spell, spell.level)}
                            disabled={
                              (token.spellSlots?.[spell.level]?.used || 0) >=
                              (token.spellSlots?.[spell.level]?.max || 0)
                            }
                          >
                            Cast
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Attunement Slots (3 max)</h3>
                <div className="space-y-2">
                  {(token.inventory || [])
                    .filter(item => item.attunement !== 'none')
                    .map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Switch
                        checked={item.attuned || false}
                        onCheckedChange={(checked) => {
                          const attunedCount = token.inventory?.filter(i => i.attuned).length || 0;
                          if (checked && attunedCount >= 3) return; // Max 3 attuned items
                          
                          const inventory = token.inventory?.map(i =>
                            i.id === item.id ? { ...i, attuned: checked } : i
                          ) || [];
                          handleUpdateToken({ inventory });
                        }}
                        disabled={
                          !item.attuned && 
                          (token.inventory?.filter(i => i.attuned).length || 0) >= 3
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">All Items</h3>
                <div className="space-y-2">
                  {(token.inventory || []).map((item) => (
                    <Card key={item.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.desc && (
                              <div className="text-sm text-gray-400">{item.desc}</div>
                            )}
                          </div>
                          {item.attuned && (
                            <Badge variant="secondary" className="text-xs">
                              Attuned
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="space-y-4">
                <h3 className="font-semibold">Features & Traits</h3>
                <div className="space-y-2">
                  {(token.features || []).map((feature) => (
                    <Card key={feature.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-gray-400">{feature.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-4">
                <h3 className="font-semibold">Notes</h3>
                <Textarea
                  value={token.notes || ''}
                  onChange={(e) => handleUpdateToken({ notes: e.target.value })}
                  placeholder="Character notes, backstory, etc..."
                  className="bg-gray-700 border-gray-600 min-h-40"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CharacterSheet;