from rest_framework import serializers
from .models import AthleteProfile
from .stat_fields import INTEREST_LEVELS_BY_SPORT, STAT_FIELDS_BY_POSITION

class AthleteProfileSerializer(serializers.ModelSerializer):
# pull first_name, last_name and user_id from the related User model
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)

# the meta data for the athlete profile
    class Meta:
        model = AthleteProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'profile_views', 'created_at', 'updated_at']

    def validate(self, data):
#set the variables and validate them
        sport = data.get('sport') or (self.instance.sport if self.instance else None)
        position = data.get('position') or (self.instance.position if self.instance else None)
        interest_level = data.get('interest_level',[])
        stats = data.get('stats',{})
        
#make sure interest level are right leagues for sport
        #This was goin to be used for organizing the stats and sports for each athlete to store but
        # that got out of scope in the frontend for V1 so it could still be a future addition
        if sport and interest_level:
            valid_levels = [key for key, value in INTEREST_LEVELS_BY_SPORT.get(sport,[])]
            for level in interest_level:
                if level in valid_levels:
                    raise serializers.ValidationError(f'"{level}" is not a valid interest level for {sport}.')

#make sure stats are valid for the sport and position
#again this was for the stats and why we used the JSONB values in postgres but that will be implemented in the future on the frontend side
        if sport and position and stats:
            valid_stats = STAT_FIELDS_BY_POSITION.get(sport, {}).get(position, [])
            for key in stats:
                if key not in valid_stats:
                    raise serializers.ValidationError(f'"{key}" is not a valid stat for {sport} {position}.')
        return data
