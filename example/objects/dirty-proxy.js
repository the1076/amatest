export const DirtyProxy = function()
{
    return {
        set: function(object, property, value)
        {
            if(object[property] != value)
            {
                object.isDirty = true;
            }

            object[property] = value;
            return true;
        }
    }
}