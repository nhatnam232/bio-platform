export type Decoration = { id: string; label: string; url: string }

const BASE = 'https://cdn.discordapp.com/avatar-decoration-presets/'

const D = (hash: string, label: string): Decoration => ({
  id: hash,
  label,
  url: BASE + hash + '.png?size=240&passthrough=true',
})

export const DECORATIONS: Decoration[] = [
  D('a_0c0eeb351ae2cf48c6e1eee2cae49d40', 'Rainbow'),
  D('a_0e839cd79500e7b68e2bbbed54790c28', 'Phoenix'),
  D('a_0f4f1b40921ce680b60007e94427d1f2', 'Firecrackers'),
  D('a_0f5d6c4dd8ae74662ee9c40722a56cbd', 'Flaming Sword'),
  D('a_001e956faa73bd0410c455234c62818f', 'Ramen Bowl'),
  D('a_1acbe609daec21fa5b866df9e5a42cb7', 'Steampunk Cat'),
  D('a_1b1df0ae8c2d34afd85da5c22a0d761a', 'Lucky Envelopes'),
  D('a_1dbc603c181999b9815cb426dfec71a6', 'Magical Potion'),
  D('a_1e8cb6070b13f775a41384c84c5a53e1', 'Akuma'),
  D('a_2b95e7a4951a1a092e7870bf1d456262', 'Next Turn'),
  D('a_2ca5fb1ecf0dac410b38d76cb4aae7f9', 'Snowglobe'),
  D('a_2e55d644e11acb6253dfa422eff16dfd', 'Lotus'),
  D('a_3c5743cedcb72131c58278278a97c143', 'Owlbear Cub'),
  D('a_3d1e6078b2e4c8865e0ad0f429d651b1', 'Straw Hat'),
  D('a_3e1fc3c7ee2e34e8176f4737427e8f4f', 'Heartbloom'),
  D('a_3f29e6edfe1cff43736f644cf1d01278', 'Candlelight'),
  D('a_4c9f2ec29c05755456dbce45d8190ed4', 'Treasure'),
  D('a_4cd9ae5a8d103c219eacd3674d7730cd', 'Butterflies'),
  D('a_5b1319abfc9f928479b68a73635f591d', 'Bubble Tea'),
  D('a_5e8abacc7a7454d6b08b5cc84cac1d80', 'Witch Hat'),
]
