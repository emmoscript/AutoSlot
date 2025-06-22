import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import type { ParkingSpace } from '../types';

interface ParkingSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: Omit<ParkingSpace, 'id' | 'created_at' | 'updated_at' | 'current_price' | 'is_available'>) => void;
  spaceToEdit?: ParkingSpace | null;
}

const initialFormState = {
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
  base_price: 0,
  zone_type: 'standard' as 'premium' | 'standard' | 'economy',
  max_hours: 24,
  features: [] as string[],
  image_url: '',
};

export const ParkingSpaceModal = ({ isOpen, onClose, onSave, spaceToEdit }: ParkingSpaceModalProps) => {
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    if (spaceToEdit) {
      setFormState({
        name: spaceToEdit.name,
        address: spaceToEdit.address,
        latitude: spaceToEdit.latitude,
        longitude: spaceToEdit.longitude,
        base_price: spaceToEdit.base_price,
        zone_type: spaceToEdit.zone_type,
        max_hours: spaceToEdit.max_hours,
        features: spaceToEdit.features || [],
        image_url: spaceToEdit.image_url || '',
      });
    } else {
      setFormState(initialFormState);
    }
  }, [spaceToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {spaceToEdit ? 'Edit Parking Space' : 'Add New Parking Space'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" id="address" value={formState.address} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input type="number" name="latitude" id="latitude" value={formState.latitude} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input type="number" name="longitude" id="longitude" value={formState.longitude} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                   <div>
                      <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Base Price (RD$)</label>
                      <input type="number" name="base_price" id="base_price" value={formState.base_price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                  <div>
                    <label htmlFor="zone_type" className="block text-sm font-medium text-gray-700">Zone</label>
                    <select name="zone_type" id="zone_type" value={formState.zone_type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="economy">Economy</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      Cancel
                    </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 