from rest_framework import serializers
from .models import AthleteProfile
from .stat_fields import INTEREST_LEVELS_BY_SPORT, STAT_FIELDS_BY_POSITION

class AthleteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AthleteProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'profile_views', 'created_at', 'updated_at']

    def validate(self, data):
#set the variables
        sport = data.get('sport') or (self.instance.sport if self.instance else None)
        position = data.get('position') or (self.instance.position if self.instance else None)
        interest_level = data.get('interest_level',[])
        stats = data.get('stats',{})
        
#make sure interest level are right leagues for sport
        if sport and interest_level:
            valid_levels = [key for key, value in INTEREST_LEVELS_BY_SPORT.get(sport,[])]
            for level in interest_level:
                if level in valid_levels:
                    raise serializers.ValidationError(f'"{level}" is not a valid interest level for {sport}.')

#make sure stats are valid for the sport and position
        if sport and position and stats:
            valid_stats = STAT_FIELDS_BY_POSITION.get(sport, {}).get(position, [])
            for key in stats:
                if key not in valid_stats:
                    raise serializers.ValidationError(f'"{key}" is not a valid stat for {sport} {position}.')
        return data
