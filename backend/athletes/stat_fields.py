# Sport/position stat fields and interest level config

STAT_FIELDS_BY_POSITION = {
    'football': {
        'quarterback': ['forty_yard_dash', 'passing_yards', 'touchdowns', 'interceptions', 'completion_pct', 'height_ft', 'weight_lb'],
        'running_back': ['forty_yard_dash', 'rushing_yards', 'touchdowns', 'receptions', 'height_ft', 'weight_lb'],
        'wide_receiver': ['forty_yard_dash', 'receptions', 'receiving_yards', 'touchdowns', 'height_ft', 'weight_lb'],
        'linebacker': ['forty_yard_dash', 'tackles', 'sacks', 'interceptions', 'height_ft', 'weight_lb'],
        'defensive_back': ['forty_yard_dash', 'tackles', 'interceptions', 'pass_deflections', 'height_ft', 'weight_lb'],
        'offensive_lineman': ['forty_yard_dash', 'bench_reps', 'height_ft', 'weight_lb'],
        'defensive_lineman': ['forty_yard_dash', 'sacks', 'tackles', 'height_ft', 'weight_lb'],
        'kicker': ['field_goal_pct', 'longest_field_goal', 'punting_avg', 'height_ft', 'weight_lb'],
    },
    'hockey': {
        'forward': ['goals', 'assists', 'plus_minus', 'shots', 'penalty_minutes'],
        'defenseman': ['goals', 'assists', 'plus_minus', 'blocked_shots', 'penalty_minutes'],
        'goalie': ['save_percentage', 'goals_against_average', 'shutouts', 'wins'],
    },
    'basketball': {
        'point_guard': ['points_per_game', 'assists_per_game', 'steals_per_game', 'turnovers'],
        'shooting_guard': ['points_per_game', 'three_point_pct', 'field_goal_pct'],
        'small_forward': ['points_per_game', 'rebounds_per_game', 'assists_per_game'],
        'power_forward': ['points_per_game', 'rebounds_per_game', 'blocks_per_game'],
        'center': ['points_per_game', 'rebounds_per_game', 'blocks_per_game', 'height_cm'],
    },
    'soccer': {
        'goalkeeper': ['save_percentage', 'clean_sheets', 'goals_against_average'],
        'defender': ['tackles', 'interceptions', 'clearances', 'appearances'],
        'midfielder': ['goals', 'assists', 'passes_completed', 'appearances'],
        'forward': ['goals', 'assists', 'shots_on_target', 'appearances'],
    },
}

INTEREST_LEVELS_BY_SPORT = {
    'football': [
        ('usports', 'USports'),
        ('cjfl', 'CJFL'),
        ('open', 'Open'),
    ],
    'hockey': [
        ('usports', 'USports'),
        ('bchl', 'BCHL'),
        ('ohl', 'OHL'),
        ('whl', 'WHL'),
        ('ajhl', 'AJHL'),
        ('sjhl', 'SJHL'),
        ('mjhl', 'MJHL'),
        ('open', 'Open'),
    ],
    'basketball': [
        ('usports', 'USports'),
        ('open', 'Open'),
    ],
    'soccer': [
        ('usports', 'USports'),
        ('cpl', 'CPL'),
        ('open', 'Open'),
    ],
}
