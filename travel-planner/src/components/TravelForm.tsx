import React, { useState } from 'react';
import { FormInput } from '../models/FormInput';

const TravelForm: React.FC = () => {
  const [formData, setFormData] = useState<FormInput>({
    originCity: '',
    destinationCity: '',
    startDate: '',
    endDate: '',
    interests: []
  });

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default TravelForm; 